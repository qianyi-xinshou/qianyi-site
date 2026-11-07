import InfiniteSpiral from './infinite-spiral/InfiniteSpiral';

export default function WorkSpiral({ base }: { base: string }) {
  const root = base.endsWith('/') ? base : `${base}/`;
  const items = [
    ['home.png', '乐见儿 App 首页'],
    ['category.png', '乐见儿 App 商品分类'],
    ['product-detail.png', '乐见儿 App 商品详情'],
    ['cart.png', '乐见儿 App 购物车'],
    ['member-center.png', '乐见儿 App 会员中心'],
    ['cover.png', '乐见儿美妆 App 项目封面'],
  ].map(([file, alt]) => ({ src: `${root}assets/lejianel/${file}`, alt }));
  return <InfiniteSpiral items={items} speed={0.3} direction="up" animationMode="auto" radius={100} cardWidth={110} cardHeight={83} verticalSpacing={38} perspective={1000} cardsPerTurn={7} centerScale={1.12} edgeFade={0.3} edgeBlur={3} pauseOnHover grayscale={0} imageFit="cover" />;
}
