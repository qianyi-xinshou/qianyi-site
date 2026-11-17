export interface PosterImage { file: string; title: string }
export interface PosterGroup { label: string; title: string; description: string; images: PosterImage[] }
export interface PosterCase { slug: string; title: string; description: string; cover: string; coverCompanion: string; accent: string; groups: PosterGroup[] }

export const posterCases: PosterCase[] = [
  {
    slug: 'opening', title: 'LEJIANEL｜门店开业视觉', cover: 'opening-cover', coverCompanion: 'opening-sign', accent: '开业活动',
    description: '围绕门店开业主题，整理主视觉、活动宣传页与线下水牌。',
    groups: [
      { label: '01 / KEY VISUAL', title: '开业主视觉', description: '以开幕主题和美妆产品组合，呈现门店开业的活动氛围。', images: [{ file: 'opening-cover', title: '方圆荟开幕主视觉' }, { file: 'opening-bashang', title: '坝上吾悦广场店开业画面' }] },
      { label: '02 / CAMPAIGN', title: '从主题到活动内容', description: '围绕护肤、彩妆香水和套盒内容，延展宣传页的视觉语言与商品信息排版。', images: [{ file: 'opening-skincare', title: '护肤秒杀' }, { file: 'opening-beauty', title: '开业秒杀' }, { file: 'opening-gifts', title: '套盒秒杀' }] },
      { label: '03 / IN-STORE', title: '延展至门店物料', description: '将开业信息、进店福利和活动规则组织到门店水牌中。', images: [{ file: 'opening-sign', title: '方圆荟开业水牌' }] },
    ],
  },
  {
    slug: 'promotion', title: 'LEJIANEL｜双十一活动视觉', cover: 'sale-cover', coverCompanion: 'sale-fangyuan', accent: '促销活动',
    description: '围绕双十一和限时秒杀，呈现活动主题、商品优惠与会员福利。',
    groups: [
      { label: '01 / CAMPAIGN', title: '双十一活动海报', description: '以活动主题与重点优惠为视觉中心，展示不同门店场景下的促销信息。', images: [{ file: 'sale-cover', title: '双十一门店通用海报' }, { file: 'sale-fangyuan', title: '方圆荟双十一海报' }] },
      { label: '02 / FLASH SALE', title: '限时秒杀正反面', description: '围绕商品图片、名称和价格，呈现成组的秒杀活动内容。', images: [{ file: 'sale-front', title: '限时秒杀 · 正面' }, { file: 'sale-back', title: '限时秒杀 · 反面' }] },
      { label: '03 / MEMBER', title: '会员专享福利', description: '通过分区与信息层级展示会员礼遇和不同档位的优惠内容。', images: [{ file: 'sale-member', title: '会员专享福利' }] },
    ],
  },
];
