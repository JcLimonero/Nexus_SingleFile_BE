"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_ui_components_components-overview_components-overview_component_ts"],{

/***/ 97109:
/*!******************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components-overview.component.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewComponent: () => (/* binding */ ComponentsOverviewComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _components_components_overview_snack_bar_components_overview_snack_bar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/components-overview-snack-bar/components-overview-snack-bar.component */ 42498);
/* harmony import */ var _components_components_overview_input_components_overview_input_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/components-overview-input/components-overview-input.component */ 36924);
/* harmony import */ var _components_components_overview_menu_components_overview_menu_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/components-overview-menu/components-overview-menu.component */ 31709);
/* harmony import */ var _components_components_overview_lists_components_overview_lists_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/components-overview-lists/components-overview-lists.component */ 53827);
/* harmony import */ var _components_components_overview_buttons_components_overview_buttons_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/components-overview-buttons/components-overview-buttons.component */ 29594);
/* harmony import */ var _components_components_overview_grid_list_components_overview_grid_list_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/components-overview-grid-list/components-overview-grid-list.component */ 56032);
/* harmony import */ var _components_components_overview_progress_components_overview_progress_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/components-overview-progress/components-overview-progress.component */ 17937);
/* harmony import */ var _components_components_overview_progress_spinner_components_overview_progress_spinner_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/components-overview-progress-spinner/components-overview-progress-spinner.component */ 55449);
/* harmony import */ var _components_components_overview_tooltip_components_overview_tooltip_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/components-overview-tooltip/components-overview-tooltip.component */ 10595);
/* harmony import */ var _components_components_overview_slider_components_overview_slider_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/components-overview-slider/components-overview-slider.component */ 91375);
/* harmony import */ var _components_components_overview_dialogs_components_overview_dialogs_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/components-overview-dialogs/components-overview-dialogs.component */ 3022);
/* harmony import */ var _components_components_overview_checkbox_components_overview_checkbox_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/components-overview-checkbox/components-overview-checkbox.component */ 34783);
/* harmony import */ var _components_components_overview_cards_components_overview_cards_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/components-overview-cards/components-overview-cards.component */ 21640);
/* harmony import */ var _components_components_overview_slide_toggle_components_overview_slide_toggle_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/components-overview-slide-toggle/components-overview-slide-toggle.component */ 23568);
/* harmony import */ var _components_components_overview_autocomplete_components_overview_autocomplete_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/components-overview-autocomplete/components-overview-autocomplete.component */ 56230);
/* harmony import */ var _components_components_overview_radio_components_overview_radio_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/components-overview-radio/components-overview-radio.component */ 33165);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/list */ 13228);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-content.directive */ 5292);
/* harmony import */ var _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @vex/components/vex-breadcrumbs/vex-breadcrumbs.component */ 19806);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-header.directive */ 72369);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout.component */ 60306);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_module__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.module */ 85299);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/cdk/overlay */ 50275);
































function ComponentsOverviewComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵlistener"]("click", function ComponentsOverviewComponent_div_8_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵrestoreView"](_r3);
      const item_r1 = restoredCtx.$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵresetView"](ctx_r2.scrollTo(item_r1.fragment));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵtextInterpolate1"](" ", item_r1.label, " ");
  }
}
const _c0 = () => ["Components", "Overview"];
class ComponentsOverviewComponent {
  constructor(scrollDispatcher) {
    this.scrollDispatcher = scrollDispatcher;
    this.navigationItems = [{
      label: 'Autocomplete',
      fragment: 'autocomplete'
    }, {
      label: 'Buttons',
      fragment: 'buttons'
    }, {
      label: 'Cards',
      fragment: 'cards'
    }, {
      label: 'Checkbox',
      fragment: 'checkbox'
    }, {
      label: 'Dialogs',
      fragment: 'dialogs'
    }, {
      label: 'Grid List',
      fragment: 'gridList'
    }, {
      label: 'Input',
      fragment: 'input'
    }, {
      label: 'Lists',
      fragment: 'lists'
    }, {
      label: 'Menu',
      fragment: 'menu'
    }, {
      label: 'Progress',
      fragment: 'progress'
    }, {
      label: 'Progress Spinner',
      fragment: 'progressSpinner'
    }, {
      label: 'Radio',
      fragment: 'radio'
    }, {
      label: 'Slider',
      fragment: 'slider'
    }, {
      label: 'Slide Toggle',
      fragment: 'slideToggle'
    }, {
      label: 'Snack Bar',
      fragment: 'snack-bar'
    }, {
      label: 'Tooltip',
      fragment: 'tooltip'
    }];
  }
  scrollTo(elementName) {
    const elem = this[elementName];
    if (!elem || !elem.nativeElement) {
      return;
    }
    this.scrollDispatcher.getAncestorScrollContainers(elem)[0].scrollTo({
      top: elem.nativeElement.offsetTop - 24,
      behavior: 'smooth'
    });
  }
  static #_ = this.ɵfac = function ComponentsOverviewComponent_Factory(t) {
    return new (t || ComponentsOverviewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵdirectiveInject"](_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_25__.ScrollDispatcher));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵdefineComponent"]({
    type: ComponentsOverviewComponent,
    selectors: [["vex-components-overview"]],
    viewQuery: function ComponentsOverviewComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_autocomplete_components_overview_autocomplete_component__WEBPACK_IMPORTED_MODULE_14__.ComponentsOverviewAutocompleteComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_buttons_components_overview_buttons_component__WEBPACK_IMPORTED_MODULE_4__.ComponentsOverviewButtonsComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_cards_components_overview_cards_component__WEBPACK_IMPORTED_MODULE_12__.ComponentsOverviewCardsComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_checkbox_components_overview_checkbox_component__WEBPACK_IMPORTED_MODULE_11__.ComponentsOverviewCheckboxComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_dialogs_components_overview_dialogs_component__WEBPACK_IMPORTED_MODULE_10__.ComponentsOverviewDialogsComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_grid_list_components_overview_grid_list_component__WEBPACK_IMPORTED_MODULE_5__.ComponentsOverviewGridListComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_input_components_overview_input_component__WEBPACK_IMPORTED_MODULE_1__.ComponentsOverviewInputComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_lists_components_overview_lists_component__WEBPACK_IMPORTED_MODULE_3__.ComponentsOverviewListsComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_menu_components_overview_menu_component__WEBPACK_IMPORTED_MODULE_2__.ComponentsOverviewMenuComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_progress_components_overview_progress_component__WEBPACK_IMPORTED_MODULE_6__.ComponentsOverviewProgressComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_progress_spinner_components_overview_progress_spinner_component__WEBPACK_IMPORTED_MODULE_7__.ComponentsOverviewProgressSpinnerComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_radio_components_overview_radio_component__WEBPACK_IMPORTED_MODULE_15__.ComponentsOverviewRadioComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_slider_components_overview_slider_component__WEBPACK_IMPORTED_MODULE_9__.ComponentsOverviewSliderComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_slide_toggle_components_overview_slide_toggle_component__WEBPACK_IMPORTED_MODULE_13__.ComponentsOverviewSlideToggleComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_snack_bar_components_overview_snack_bar_component__WEBPACK_IMPORTED_MODULE_0__.ComponentsOverviewSnackBarComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵviewQuery"](_components_components_overview_tooltip_components_overview_tooltip_component__WEBPACK_IMPORTED_MODULE_8__.ComponentsOverviewTooltipComponent, 7, _angular_core__WEBPACK_IMPORTED_MODULE_24__.ElementRef);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.autocomplete = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.buttons = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.cards = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.checkbox = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.dialogs = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.gridList = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.input = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.lists = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.menu = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.progress = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.progressSpinner = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.radio = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.slider = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.slideToggle = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.snackBar = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵloadQuery"]()) && (ctx.tooltip = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵStandaloneFeature"]],
    decls: 26,
    vars: 21,
    consts: [["mode", "simple"], [1, "flex", "flex-col", "items-start", "justify-center"], [1, "container"], [1, "title", "mt-0", "mb-1"], [3, "crumbs"], [1, "flex", "items-start", "justify-start", "gap-6", "container"], [1, "sticky", "top-20", "flex-col", "flex-none", "w-[200px]", "hidden", "sm:flex"], ["class", "px-4 py-3 rounded-xl hover:bg-hover transition cursor-pointer relative", "matRipple", "", 3, "click", 4, "ngFor", "ngForOf"], [1, "max-w-full", "flex", "flex-col", "gap-6"], ["matRipple", "", 1, "px-4", "py-3", "rounded-xl", "hover:bg-hover", "transition", "cursor-pointer", "relative", 3, "click"]],
    template: function ComponentsOverviewComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementStart"](0, "vex-page-layout", 0)(1, "vex-page-layout-header", 1)(2, "div", 2)(3, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵtext"](4, "Components");
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelement"](5, "vex-breadcrumbs", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementStart"](6, "vex-page-layout-content", 5)(7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵtemplate"](8, ComponentsOverviewComponent_div_8_Template, 2, 1, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementStart"](9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelement"](10, "vex-components-overview-autocomplete")(11, "vex-components-overview-buttons")(12, "vex-components-overview-cards")(13, "vex-components-overview-checkbox")(14, "vex-components-overview-dialogs")(15, "vex-components-overview-grid-list")(16, "vex-components-overview-input")(17, "vex-components-overview-lists")(18, "vex-components-overview-menu")(19, "vex-components-overview-progress")(20, "vex-components-overview-progress-spinner")(21, "vex-components-overview-radio")(22, "vex-components-overview-slider")(23, "vex-components-overview-slide-toggle")(24, "vex-components-overview-snack-bar")(25, "vex-components-overview-tooltip");
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("crumbs", _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵpureFunction0"](20, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@stagger", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("ngForOf", ctx.navigationItems);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@stagger", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_24__["ɵɵproperty"]("@fadeInUp", undefined);
      }
    },
    dependencies: [_vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_22__.VexPageLayoutComponent, _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_21__.VexPageLayoutHeaderDirective, _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_20__.VexBreadcrumbsComponent, _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_19__.VexPageLayoutContentDirective, _angular_material_list__WEBPACK_IMPORTED_MODULE_26__.MatListModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_27__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_27__.MatRipple, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_28__.MatSnackBarModule, _vex_components_vex_highlight_vex_highlight_module__WEBPACK_IMPORTED_MODULE_23__.VexHighlightModule, _components_components_overview_autocomplete_components_overview_autocomplete_component__WEBPACK_IMPORTED_MODULE_14__.ComponentsOverviewAutocompleteComponent, _components_components_overview_buttons_components_overview_buttons_component__WEBPACK_IMPORTED_MODULE_4__.ComponentsOverviewButtonsComponent, _components_components_overview_cards_components_overview_cards_component__WEBPACK_IMPORTED_MODULE_12__.ComponentsOverviewCardsComponent, _components_components_overview_checkbox_components_overview_checkbox_component__WEBPACK_IMPORTED_MODULE_11__.ComponentsOverviewCheckboxComponent, _components_components_overview_dialogs_components_overview_dialogs_component__WEBPACK_IMPORTED_MODULE_10__.ComponentsOverviewDialogsComponent, _components_components_overview_grid_list_components_overview_grid_list_component__WEBPACK_IMPORTED_MODULE_5__.ComponentsOverviewGridListComponent, _components_components_overview_input_components_overview_input_component__WEBPACK_IMPORTED_MODULE_1__.ComponentsOverviewInputComponent, _components_components_overview_lists_components_overview_lists_component__WEBPACK_IMPORTED_MODULE_3__.ComponentsOverviewListsComponent, _components_components_overview_menu_components_overview_menu_component__WEBPACK_IMPORTED_MODULE_2__.ComponentsOverviewMenuComponent, _components_components_overview_progress_components_overview_progress_component__WEBPACK_IMPORTED_MODULE_6__.ComponentsOverviewProgressComponent, _components_components_overview_progress_spinner_components_overview_progress_spinner_component__WEBPACK_IMPORTED_MODULE_7__.ComponentsOverviewProgressSpinnerComponent, _components_components_overview_radio_components_overview_radio_component__WEBPACK_IMPORTED_MODULE_15__.ComponentsOverviewRadioComponent, _components_components_overview_slider_components_overview_slider_component__WEBPACK_IMPORTED_MODULE_9__.ComponentsOverviewSliderComponent, _components_components_overview_slide_toggle_components_overview_slide_toggle_component__WEBPACK_IMPORTED_MODULE_13__.ComponentsOverviewSlideToggleComponent, _components_components_overview_snack_bar_components_overview_snack_bar_component__WEBPACK_IMPORTED_MODULE_0__.ComponentsOverviewSnackBarComponent, _components_components_overview_tooltip_components_overview_tooltip_component__WEBPACK_IMPORTED_MODULE_8__.ComponentsOverviewTooltipComponent, _angular_common__WEBPACK_IMPORTED_MODULE_29__.NgForOf],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_18__.stagger80ms, _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_16__.fadeInRight400ms, _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_17__.fadeInUp400ms]
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_ui_components_components-overview_components-overview_component_ts.js.map