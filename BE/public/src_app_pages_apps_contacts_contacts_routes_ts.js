"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_contacts_contacts_routes_ts"],{

/***/ 29925:
/*!********************************************************!*\
  !*** ./src/app/pages/apps/contacts/contacts.routes.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const routes = [{
  path: 'grid',
  children: [{
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  }, {
    path: ':activeCategory',
    loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_tabs_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-src_vex_animations_fade-in-right_animation_ts-src_vex_animations_fade-in-up_animation-d2eafb"), __webpack_require__.e("src_app_pages_apps_contacts_contacts-grid_contacts-grid_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./contacts-grid/contacts-grid.component */ 62449)).then(m => m.ContactsGridComponent),
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: false
    }
  }]
}, {
  path: 'table',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-src_vex_animations_fade-in-right_animation_ts-src_vex_animations_fade-in-up_animation-d2eafb"), __webpack_require__.e("src_app_pages_apps_contacts_contacts-table_contacts-table_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./contacts-table/contacts-table.component */ 15488)).then(m => m.ContactsTableComponent),
  data: {
    scrollDisabled: true,
    toolbarShadowEnabled: true
  }
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (routes);

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_contacts_contacts_routes_ts.js.map