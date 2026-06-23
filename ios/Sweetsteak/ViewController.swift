import UIKit
import WebKit
import AuthenticationServices
import UserNotifications
import SafariServices

class ViewController: UIViewController {

    private let appURL = URL(string: "https://www.sweetsteak.co.uk")!

    private var webView: WKWebView!
    private var refreshControl: UIRefreshControl!
    private var popupWebView: WKWebView?

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        setupRefreshControl()
        injectUserSelectNone()
        observeNotificationEvents()
        loadApp()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }

    // MARK: - Setup

    private func setupWebView() {
        let config = WKWebViewConfiguration()
        // Allow inline media and the Clipboard API surface
        config.allowsInlineMediaPlayback = true
        config.preferences.isElementFullscreenEnabled = true

        webView = WKWebView(frame: .zero, configuration: config)
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.configuration.userContentController.add(self, name: "sweetsteak")

        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        injectIOSClass()
    }

    private func setupRefreshControl() {
        refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor(red: 0.078, green: 0.353, blue: 0.200, alpha: 1)
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        webView.scrollView.addSubview(refreshControl)
    }

    private func injectIOSClass() {
        let script = WKUserScript(
            source: "document.documentElement.classList.add('ios-app');",
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        webView.configuration.userContentController.addUserScript(script)
    }

    private func injectUserSelectNone() {
        // Suppress iOS text-selection loupe on tap-hold
        let script = WKUserScript(
            source: "document.documentElement.style.webkitUserSelect='none';",
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )
        webView.configuration.userContentController.addUserScript(script)
    }

    private func loadApp() {
        let cacheTypes: Set<String> = [WKWebsiteDataTypeDiskCache, WKWebsiteDataTypeMemoryCache]
        WKWebsiteDataStore.default().removeData(ofTypes: cacheTypes, modifiedSince: .distantPast) { [weak self] in
            guard let self else { return }
            self.webView.load(URLRequest(url: self.appURL, cachePolicy: .reloadIgnoringLocalAndRemoteCacheData))
        }
    }

    @objc private func handleRefresh() {
        loadApp()
    }

    // MARK: - Notifications

    private func observeNotificationEvents() {
        NotificationCenter.default.addObserver(forName: .pushTokenReceived, object: nil, queue: .main) { [weak self] note in
            guard let token = note.object as? String else { return }
            self?.sendToWeb("window.handlePushToken && window.handlePushToken({token:'\(token)'})")
        }
        NotificationCenter.default.addObserver(forName: .notificationTapped, object: nil, queue: .main) { [weak self] _ in
            // Route to leaderboard on any notification tap
            self?.sendToWeb("window.handleNotificationTap && window.handleNotificationTap()")
        }
    }

    private func handleRequestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { [weak self] granted, _ in
            DispatchQueue.main.async {
                if granted { UIApplication.shared.registerForRemoteNotifications() }
                let status = granted ? "authorized" : "denied"
                self?.sendToWeb("window.handleNotificationPermission && window.handleNotificationPermission({granted:\(granted),status:'\(status)'})")
            }
        }
    }

    private func handleGetNotificationStatus() {
        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            let status: String
            switch settings.authorizationStatus {
            case .authorized, .provisional, .ephemeral: status = "authorized"
            case .denied:                               status = "denied"
            default:                                    status = "notDetermined"
            }
            let token = AppDelegate.pushToken.map { "'\($0)'" } ?? "null"
            DispatchQueue.main.async {
                self?.sendToWeb("window.handleNotificationStatus && window.handleNotificationStatus({status:'\(status)',token:\(token)})")
            }
        }
    }

    private func sendToWeb(_ js: String) {
        webView.evaluateJavaScript(js)
    }

    // MARK: - Sign in with Apple

    private func handleSignInWithApple() {
        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName]

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.presentationContextProvider = self
        controller.performRequests()
    }
}

// MARK: - WKNavigationDelegate

extension ViewController: WKNavigationDelegate {

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        refreshControl.endRefreshing()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        refreshControl.endRefreshing()
        showOfflineAlert()
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        refreshControl.endRefreshing()
        showOfflineAlert()
    }

    private func showOfflineAlert() {
        let alert = UIAlertController(
            title: "No connection",
            message: "Sweetsteak needs an internet connection. Check your network and try again.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "Retry", style: .default) { [weak self] _ in
            self?.loadApp()
        })
        present(alert, animated: true)
    }
}

// MARK: - WKUIDelegate (prompt / confirm / alert)

extension ViewController: WKUIDelegate {

    // window.open() — required for Sign in with Apple JS SDK popup
    func webView(_ webView: WKWebView,
                 createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction,
                 windowFeatures: WKWindowFeatures) -> WKWebView? {
        let popup = WKWebView(frame: .zero, configuration: configuration)
        popup.translatesAutoresizingMaskIntoConstraints = false
        popup.navigationDelegate = self
        popup.uiDelegate = self
        view.addSubview(popup)
        NSLayoutConstraint.activate([
            popup.topAnchor.constraint(equalTo: view.topAnchor),
            popup.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            popup.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            popup.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        popupWebView = popup
        return popup
    }

    // window.close() — tear down the popup after auth completes
    func webViewDidClose(_ webView: WKWebView) {
        guard webView === popupWebView else { return }
        popupWebView?.removeFromSuperview()
        popupWebView = nil
    }

    // window.alert()
    func webView(_ webView: WKWebView,
                 runJavaScriptAlertPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(alert, animated: true)
    }

    // window.confirm()
    func webView(_ webView: WKWebView,
                 runJavaScriptConfirmPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        present(alert, animated: true)
    }

    // window.prompt()
    func webView(_ webView: WKWebView,
                 runJavaScriptTextInputPanelWithPrompt prompt: String,
                 defaultText: String?,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping (String?) -> Void) {
        let alert = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        alert.addTextField { field in
            field.text = defaultText
            field.isSecureTextEntry = prompt.lowercased().contains("pin")
            field.placeholder = "Enter PIN"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(nil) })
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            completionHandler(alert.textFields?.first?.text)
        })
        present(alert, animated: true)
    }
}

// MARK: - WKScriptMessageHandler (JS -> native bridge)

extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController,
                                didReceive message: WKScriptMessage) {
        guard message.name == "sweetsteak",
              let body = message.body as? [String: Any],
              let action = body["action"] as? String else { return }

        switch action {
        case "signInWithApple":
            handleSignInWithApple()
        case "requestNotificationPermission":
            handleRequestNotificationPermission()
        case "getNotificationStatus":
            handleGetNotificationStatus()
        case "openNotificationSettings":
            if let url = URL(string: UIApplication.openSettingsURLString) {
                UIApplication.shared.open(url)
            }
        default:
            break
        }
    }
}

// MARK: - ASAuthorizationControllerDelegate

extension ViewController: ASAuthorizationControllerDelegate {
    func authorizationController(controller: ASAuthorizationController,
                                  didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            return
        }

        let userId = credential.user
        var name = ""
        if let fullName = credential.fullName {
            name = PersonNameComponentsFormatter().string(from: fullName)
        }

        let payload: [String: Any] = ["userId": userId, "name": name]
        guard let data = try? JSONSerialization.data(withJSONObject: payload),
              let json = String(data: data, encoding: .utf8) else { return }

        DispatchQueue.main.async { [weak self] in
            self?.webView.evaluateJavaScript("window.handleAppleSignIn(\(json));")
        }
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        print("⚠️ Sign in with Apple failed: \(error)")
        if let authError = error as? ASAuthorizationError {
            print("⚠️ ASAuthorizationError code: \(authError.code.rawValue) (\(authError.code))")
        }
        DispatchQueue.main.async { [weak self] in
            self?.webView.evaluateJavaScript("window.handleAppleSignInError && window.handleAppleSignInError();")
        }
    }
}

// MARK: - ASAuthorizationControllerPresentationContextProviding

extension ViewController: ASAuthorizationControllerPresentationContextProviding {
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        view.window ?? ASPresentationAnchor()
    }
}
