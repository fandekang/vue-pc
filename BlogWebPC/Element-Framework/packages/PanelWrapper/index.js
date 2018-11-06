import PanelWrapper from "./src/panel.vue";
import PanelListWrapper from "./src/panelList.vue";

const install = function(Vue) {
  Vue.component(PanelWrapper.name, PanelWrapper);
  Vue.component(PanelListWrapper.name, PanelListWrapper);
};

export {PanelWrapper, PanelListWrapper, install};
