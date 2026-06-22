export const RANKED_TEAMS = [
  'Spain','Argentina','France','England','Brazil','Portugal',
  'Netherlands','Belgium','Germany','Croatia','Morocco','Colombia',
  'Mexico','Uruguay','United States','Switzerland','Senegal','Japan',
  'Iran','South Korea','Ecuador','Austria','Türkiye','Australia',
  'Canada','Norway','Sweden','Panama','Egypt','Algeria','Paraguay',
  'Tunisia','Scotland','Ivory Coast','Czechia','Qatar','Uzbekistan',
  'Saudi Arabia','Iraq','DR Congo','South Africa','Bosnia & Herzegovina',
  'Nigeria','Kenya','Curaçao','Cape Verde','New Zealand','Cameroon',
  'Ghana','Honduras',
];

export const TIER_MAP = {};
RANKED_TEAMS.forEach((t, i) => {
  TIER_MAP[t] = i < 12 ? 'A' : i < 24 ? 'B' : i < 36 ? 'C' : 'D';
});
export const TIER_RANK = { A: 1, B: 2, C: 3, D: 4 };

export const TEAM_FLAGS = {
  'Spain': '🇪🇸', 'Argentina': '🇦🇷', 'France': '🇫🇷',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Brazil': '🇧🇷', 'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Germany': '🇩🇪',
  'Croatia': '🇭🇷', 'Morocco': '🇲🇦', 'Colombia': '🇨🇴',
  'Mexico': '🇲🇽', 'Uruguay': '🇺🇾', 'United States': '🇺🇸',
  'Switzerland': '🇨🇭', 'Senegal': '🇸🇳', 'Japan': '🇯🇵',
  'Iran': '🇮🇷', 'South Korea': '🇰🇷', 'Ecuador': '🇪🇨',
  'Austria': '🇦🇹', 'Türkiye': '🇹🇷', 'Australia': '🇦🇺',
  'Canada': '🇨🇦', 'Norway': '🇳🇴', 'Sweden': '🇸🇪',
  'Panama': '🇵🇦', 'Egypt': '🇪🇬', 'Algeria': '🇩🇿',
  'Paraguay': '🇵🇾', 'Tunisia': '🇹🇳', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Ivory Coast': '🇨🇮', 'Czechia': '🇨🇿', 'Qatar': '🇶🇦',
  'Uzbekistan': '🇺🇿', 'Saudi Arabia': '🇸🇦', 'Iraq': '🇮🇶',
  'DR Congo': '🇨🇩', 'South Africa': '🇿🇦',
  'Bosnia & Herzegovina': '🇧🇦', 'Nigeria': '🇳🇬',
  'Kenya': '🇰🇪', 'Curaçao': '🇨🇼', 'Cape Verde': '🇨🇻',
  'New Zealand': '🇳🇿', 'Cameroon': '🇨🇲', 'Ghana': '🇬🇭',
  'Honduras': '🇭🇳',
};

export const TEAM_ALIAS = {
  'Turkey': 'Türkiye', 'Türkiye': 'Türkiye',
  "Côte d'Ivoire": 'Ivory Coast', "Cote d'Ivoire": 'Ivory Coast',
  'Congo DR': 'DR Congo', 'Democratic Republic of Congo': 'DR Congo',
  'Bosnia-Herzegovina': 'Bosnia & Herzegovina',
  'Bosnia And Herzegovina': 'Bosnia & Herzegovina',
  'Korea Republic': 'South Korea', 'Czech Republic': 'Czechia',
  'USA': 'United States', 'IR Iran': 'Iran',
  'Curaçao': 'Curaçao', 'Cabo Verde': 'Cape Verde',
  'Cape Verde Islands': 'Cape Verde',
};

export const TLA_ALIAS = {
  KOR: 'South Korea', CIV: 'Ivory Coast', CZE: 'Czechia',
  COD: 'DR Congo', BIH: 'Bosnia & Herzegovina', TUR: 'Türkiye',
  USA: 'United States', IRN: 'Iran',
};

export function normTeam(name, tla) {
  return TEAM_ALIAS[name] || TLA_ALIAS[tla] || name;
}

export function teamFlag(name) {
  return TEAM_FLAGS[name] || '';
}

// Returns how many tiers the winner is below the loser (0 = no upset)
export function giantKillTiers(winnerTeam, loserTeam) {
  const wt = TIER_MAP[winnerTeam];
  const lt = TIER_MAP[loserTeam];
  if (!wt || !lt) return 0;
  return Math.max(0, TIER_RANK[lt] - TIER_RANK[wt]);
}
