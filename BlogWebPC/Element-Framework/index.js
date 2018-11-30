import MenuWrapper from "./packages/MenuWrapper/index.js";
import GridWrapper from "./packages/GridWrapper/index.js";
import {PanelWrapper, PanelListWrapper} from "./packages/PanelWrapper/index.js";

const components = [
  MenuWrapper,
  GridWrapper,
  PanelWrapper,
  PanelListWrapper
];

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$menu_wrapper_install = MenuWrapper.installMenu;
  Vue.prototype.$grid_wrapper_install = GridWrapper.installGrid;
  Vue.prototype.$panel_wrapper_install = PanelWrapper.installPanel;
  Vue.prototype.$panelList_wrapper_install = PanelListWrapper.installPanelList;
};
export default install;
