export interface Section {
  code: string;
  name: string;
  flag: string;
  color: string;
  stickers: string[];
}

function teamStickers(): string[] {
  return Array.from({ length: 20 }, (_, i) => String(i + 1));
}

export const SECTIONS: Section[] = [
  {
    code: 'FWC',
    name: 'FIFA World Cup',
    flag: '🏆',
    color: '#D4AF37',
    stickers: ['00','FWC1','FWC2','FWC3','FWC4','FWC5','FWC6','FWC7','FWC8',
               'FWC9','FWC10','FWC11','FWC12','FWC13','FWC14','FWC15','FWC16',
               'FWC17','FWC18','FWC19'],
  },
  { code: 'MEX', name: 'Mexico',              flag: '🇲🇽', color: '#006847', stickers: teamStickers() },
  { code: 'RSA', name: 'South Africa',        flag: '🇿🇦', color: '#007A4D', stickers: teamStickers() },
  { code: 'KOR', name: 'South Korea',         flag: '🇰🇷', color: '#CD2E3A', stickers: teamStickers() },
  { code: 'CZE', name: 'Czechia',             flag: '🇨🇿', color: '#D7141A', stickers: teamStickers() },
  { code: 'CAN', name: 'Canada',              flag: '🇨🇦', color: '#FF0000', stickers: teamStickers() },
  { code: 'BIH', name: 'Bosnia & Herzegovina',flag: '🇧🇦', color: '#002395', stickers: teamStickers() },
  { code: 'QAT', name: 'Qatar',               flag: '🇶🇦', color: '#8D1B3D', stickers: teamStickers() },
  { code: 'SUI', name: 'Switzerland',         flag: '🇨🇭', color: '#FF0000', stickers: teamStickers() },
  { code: 'BRA', name: 'Brazil',              flag: '🇧🇷', color: '#009C3B', stickers: teamStickers() },
  { code: 'MAR', name: 'Morocco',             flag: '🇲🇦', color: '#C1272D', stickers: teamStickers() },
  { code: 'HAI', name: 'Haiti',               flag: '🇭🇹', color: '#00209F', stickers: teamStickers() },
  { code: 'SCO', name: 'Scotland',            flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#005EB8', stickers: teamStickers() },
  { code: 'USA', name: 'USA',                 flag: '🇺🇸', color: '#002868', stickers: teamStickers() },
  { code: 'PAR', name: 'Paraguay',            flag: '🇵🇾', color: '#D52B1E', stickers: teamStickers() },
  { code: 'AUS', name: 'Australia',           flag: '🇦🇺', color: '#00843D', stickers: teamStickers() },
  { code: 'TUR', name: 'Türkiye',             flag: '🇹🇷', color: '#E30A17', stickers: teamStickers() },
  { code: 'GER', name: 'Germany',             flag: '🇩🇪', color: '#DD0000', stickers: teamStickers() },
  { code: 'CUW', name: 'Curaçao',             flag: '🇨🇼', color: '#003DA5', stickers: teamStickers() },
  { code: 'CIV', name: 'Ivory Coast',         flag: '🇨🇮', color: '#F77F00', stickers: teamStickers() },
  { code: 'ECU', name: 'Ecuador',             flag: '🇪🇨', color: '#FFD100', stickers: teamStickers() },
  { code: 'NED', name: 'Netherlands',         flag: '🇳🇱', color: '#FF4F00', stickers: teamStickers() },
  { code: 'JPN', name: 'Japan',               flag: '🇯🇵', color: '#BC002D', stickers: teamStickers() },
  { code: 'SWE', name: 'Sweden',              flag: '🇸🇪', color: '#006AA7', stickers: teamStickers() },
  { code: 'TUN', name: 'Tunisia',             flag: '🇹🇳', color: '#E70013', stickers: teamStickers() },
  { code: 'BEL', name: 'Belgium',             flag: '🇧🇪', color: '#EF3340', stickers: teamStickers() },
  { code: 'EGY', name: 'Egypt',               flag: '🇪🇬', color: '#C8102E', stickers: teamStickers() },
  { code: 'IRN', name: 'Iran',                flag: '🇮🇷', color: '#239F40', stickers: teamStickers() },
  { code: 'NZL', name: 'New Zealand',         flag: '🇳🇿', color: '#00247D', stickers: teamStickers() },
  { code: 'ESP', name: 'Spain',               flag: '🇪🇸', color: '#AA151B', stickers: teamStickers() },
  { code: 'CPV', name: 'Cape Verde',          flag: '🇨🇻', color: '#003893', stickers: teamStickers() },
  { code: 'KSA', name: 'Saudi Arabia',        flag: '🇸🇦', color: '#165D31', stickers: teamStickers() },
  { code: 'URU', name: 'Uruguay',             flag: '🇺🇾', color: '#5EB6E4', stickers: teamStickers() },
  { code: 'FRA', name: 'France',              flag: '🇫🇷', color: '#002395', stickers: teamStickers() },
  { code: 'SEN', name: 'Senegal',             flag: '🇸🇳', color: '#00853F', stickers: teamStickers() },
  { code: 'IRQ', name: 'Iraq',                flag: '🇮🇶', color: '#007A3D', stickers: teamStickers() },
  { code: 'NOR', name: 'Norway',              flag: '🇳🇴', color: '#EF2B2D', stickers: teamStickers() },
  { code: 'ARG', name: 'Argentina',           flag: '🇦🇷', color: '#74ACDF', stickers: teamStickers() },
  { code: 'ALG', name: 'Algeria',             flag: '🇩🇿', color: '#006233', stickers: teamStickers() },
  { code: 'AUT', name: 'Austria',             flag: '🇦🇹', color: '#ED2939', stickers: teamStickers() },
  { code: 'JOR', name: 'Jordan',              flag: '🇯🇴', color: '#007A3D', stickers: teamStickers() },
  { code: 'POR', name: 'Portugal',            flag: '🇵🇹', color: '#006600', stickers: teamStickers() },
  { code: 'COD', name: 'Congo DR',            flag: '🇨🇩', color: '#007FFF', stickers: teamStickers() },
  { code: 'UZB', name: 'Uzbekistan',          flag: '🇺🇿', color: '#1EB53A', stickers: teamStickers() },
  { code: 'COL', name: 'Colombia',            flag: '🇨🇴', color: '#FCD116', stickers: teamStickers() },
  { code: 'ENG', name: 'England',             flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CF081F', stickers: teamStickers() },
  { code: 'CRO', name: 'Croatia',             flag: '🇭🇷', color: '#FF0000', stickers: teamStickers() },
  { code: 'GHA', name: 'Ghana',               flag: '🇬🇭', color: '#006B3F', stickers: teamStickers() },
  { code: 'PAN', name: 'Panama',              flag: '🇵🇦', color: '#DA121A', stickers: teamStickers() },
];
