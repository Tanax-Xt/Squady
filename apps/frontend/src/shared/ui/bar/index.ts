import Center, { type BarCenterProps as CenterProps } from "./Center";
import End, { type BarEndProps as EndProps } from "./End";
import Root, { type BarRoot as RootProps } from "./Root";
import Start, { type BarStartProps as StartProps } from "./Start";

export type { CenterProps, EndProps, RootProps, StartProps };

export { Center, End, Root, Start };

const Bar = Object.assign(Root, {
  Center,
  End,
  Start,
});

export default Bar;
