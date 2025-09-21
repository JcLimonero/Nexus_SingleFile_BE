"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_contacts_contacts-table_contacts-table_component_ts"],{

/***/ 41997:
/*!*********************************************************************************************************!*\
  !*** ./src/app/pages/apps/contacts/contacts-table/contacts-data-table/contacts-data-table.component.ts ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactsDataTableComponent: () => (/* binding */ ContactsDataTableComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _vex_animations_scale_fade_in_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/animations/scale-fade-in.animation */ 2852);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/components/vex-scrollbar/vex-scrollbar.component */ 19844);






















function ContactsDataTableComponent_ng_container_3_ng_container_1_th_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", column_r5.label, " ");
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_1_td_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r13 = ctx.$implicit;
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", column_r5.cssClasses);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", row_r13[column_r5.property], " ");
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_1_th_1_Template, 2, 1, "th", 15)(2, ContactsDataTableComponent_ng_container_3_ng_container_1_td_2_Template, 2, 2, "td", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matColumnDef", column_r5.property);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_2_th_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", column_r5.label, " ");
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_2_td_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 18)(1, "mat-checkbox", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ContactsDataTableComponent_ng_container_3_ng_container_2_td_2_Template_mat_checkbox_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const row_r19 = ctx.$implicit;
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", column_r5.cssClasses);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("checked", row_r19[column_r5.property]);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_2_th_1_Template, 2, 1, "th", 15)(2, ContactsDataTableComponent_ng_container_3_ng_container_2_td_2_Template, 2, 2, "td", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matColumnDef", column_r5.property);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_3_th_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", column_r5.label, " ");
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_3_td_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "img", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r26 = ctx.$implicit;
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", column_r5.cssClasses);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", row_r26[column_r5.property], _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_3_th_1_Template, 2, 1, "th", 15)(2, ContactsDataTableComponent_ng_container_3_ng_container_3_td_2_Template, 2, 2, "td", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matColumnDef", column_r5.property);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_th_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", column_r5.label, " ");
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_mat_icon_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "mat-icon", 27);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_mat_icon_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "mat-icon", 28);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 23)(1, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_Template_button_click_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r38);
      const row_r34 = restoredCtx.$implicit;
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r37.emitToggleStar($event, row_r34.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_mat_icon_2_Template, 1, 0, "mat-icon", 25)(3, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_mat_icon_3_Template, 1, 0, "mat-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const row_r34 = ctx.$implicit;
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", column_r5.cssClasses);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", row_r34[column_r5.property]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !row_r34[column_r5.property]);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_th_1_Template, 2, 1, "th", 15)(2, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_td_2_Template, 4, 3, "td", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_th_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", column_r5.label, " ");
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_td_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 23)(1, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_td_2_Template_button_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "mat-icon", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", column_r5.cssClasses);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matMenuTriggerFor", _r4);
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_th_1_Template, 2, 1, "th", 15)(2, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_td_2_Template, 3, 2, "td", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
}
function ContactsDataTableComponent_ng_container_3_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_1_Template, 3, 0, "ng-container", 21)(2, ContactsDataTableComponent_ng_container_3_ng_container_4_ng_container_2_Template, 3, 0, "ng-container", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const column_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matColumnDef", column_r5.property);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", column_r5.property === "starred");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", column_r5.property === "menu");
  }
}
function ContactsDataTableComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ContactsDataTableComponent_ng_container_3_ng_container_1_Template, 3, 1, "ng-container", 13)(2, ContactsDataTableComponent_ng_container_3_ng_container_2_Template, 3, 1, "ng-container", 13)(3, ContactsDataTableComponent_ng_container_3_ng_container_3_Template, 3, 1, "ng-container", 13)(4, ContactsDataTableComponent_ng_container_3_ng_container_4_Template, 3, 3, "ng-container", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const column_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", column_r5.type === "text");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", column_r5.type === "checkbox");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", column_r5.type === "image");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", column_r5.type === "button");
  }
}
function ContactsDataTableComponent_tr_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 31);
  }
}
function ContactsDataTableComponent_tr_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ContactsDataTableComponent_tr_5_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r49);
      const row_r47 = restoredCtx.$implicit;
      const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r48.openContact.emit(row_r47.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@fadeInUp", undefined);
  }
}
function ContactsDataTableComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "h2", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, " No contacts matching your filters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@scaleFadeIn", undefined);
  }
}
class ContactsDataTableComponent {
  constructor() {
    this.pageSize = 20;
    this.pageSizeOptions = [10, 20, 50];
    this.searchStr = '';
    this.toggleStar = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.openContact = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.visibleColumns = [];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatTableDataSource();
  }
  ngOnInit() {}
  ngOnChanges(changes) {
    if (changes['columns']) {
      this.visibleColumns = this.columns.map(column => column.property);
    }
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['searchStr']) {
      this.dataSource.filter = (this.searchStr || '').trim().toLowerCase();
    }
  }
  emitToggleStar(event, id) {
    event.stopPropagation();
    this.toggleStar.emit(id);
  }
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  static #_ = this.ɵfac = function ContactsDataTableComponent_Factory(t) {
    return new (t || ContactsDataTableComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: ContactsDataTableComponent,
    selectors: [["vex-contacts-data-table"]],
    viewQuery: function ContactsDataTableComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, 7);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.paginator = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
      }
    },
    inputs: {
      data: "data",
      columns: "columns",
      pageSize: "pageSize",
      pageSizeOptions: "pageSizeOptions",
      searchStr: "searchStr"
    },
    outputs: {
      toggleStar: "toggleStar",
      openContact: "openContact"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵProvidersFeature"]([{
      provide: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      }
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵNgOnChangesFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 18,
    vars: 11,
    consts: [[1, "h-full", "relative"], [1, "flex", "flex-col", "justify-between"], ["mat-table", "", "matSort", "", 1, "w-full", "flex-auto", 3, "dataSource"], [4, "ngFor", "ngForOf"], ["mat-header-row", "", 4, "matHeaderRowDef", "matHeaderRowDefSticky"], ["class", "hover:bg-hover cursor-pointer", "mat-row", "", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["class", "flex-auto flex flex-col items-center justify-center", 4, "ngIf"], [1, "sticky", "bottom-0", "left-0", "right-0", "border-t", "flex-none", 3, "pageSizeOptions", "pageSize"], ["xPosition", "before", "yPosition", "below"], ["contactMenu", "matMenu"], ["mat-menu-item", ""], ["svgIcon", "mat:edit"], ["svgIcon", "mat:delete_forever"], [3, "matColumnDef", 4, "ngIf"], [3, "matColumnDef"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["mat-cell", "", 3, "ngClass", 4, "matCellDef"], ["mat-header-cell", "", "mat-sort-header", ""], ["mat-cell", "", 3, "ngClass"], [3, "checked", "click"], [1, "avatar", "h-9", "w-9", "align-middle", "my-2", 3, "src"], [4, "ngIf"], ["class", "w-10", "mat-cell", "", 3, "ngClass", 4, "matCellDef"], ["mat-cell", "", 1, "w-10", 3, "ngClass"], ["mat-icon-button", "", "type", "button", 3, "click"], ["class", "text-amber-600", "svgIcon", "mat:star", 4, "ngIf"], ["svgIcon", "mat:star_border", 4, "ngIf"], ["svgIcon", "mat:star", 1, "text-amber-600"], ["svgIcon", "mat:star_border"], ["mat-icon-button", "", "type", "button", 3, "matMenuTriggerFor", "click"], ["svgIcon", "mat:more_vert"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-hover", "cursor-pointer", 3, "click"], [1, "flex-auto", "flex", "flex-col", "items-center", "justify-center"], ["src", "assets/img/illustrations/idea.svg", 1, "m-12", "h-64"], [1, "headline", "m-0", "text-center"]],
    template: function ContactsDataTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "vex-scrollbar", 0)(1, "div", 1)(2, "table", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, ContactsDataTableComponent_ng_container_3_Template, 5, 4, "ng-container", 3)(4, ContactsDataTableComponent_tr_4_Template, 1, 0, "tr", 4)(5, ContactsDataTableComponent_tr_5_Template, 1, 1, "tr", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, ContactsDataTableComponent_div_6_Template, 4, 1, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "mat-paginator", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "mat-menu", 8, 9)(10, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Edit Contact");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](15, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17, "Delete Contact");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@stagger", ctx.dataSource.filteredData)("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.columns);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matHeaderRowDef", ctx.visibleColumns)("matHeaderRowDefSticky", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matRowDefColumns", ctx.visibleColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.dataSource.filteredData.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("hidden", ctx.dataSource.filteredData.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("pageSizeOptions", ctx.pageSizeOptions)("pageSize", ctx.pageSize);
      }
    },
    dependencies: [_vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_3__.VexScrollbarComponent, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatRow, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortHeader, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgFor, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgClass, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__.MatCheckbox, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_material_menu__WEBPACK_IMPORTED_MODULE_13__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_13__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_13__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_13__.MatMenuTrigger, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_0__.stagger20ms, _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInUp400ms, _vex_animations_scale_fade_in_animation__WEBPACK_IMPORTED_MODULE_2__.scaleFadeIn400ms]
    }
  });
}

/***/ }),

/***/ 20193:
/*!*********************************************************************************************************!*\
  !*** ./src/app/pages/apps/contacts/contacts-table/contacts-table-menu/contacts-table-menu.component.ts ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactsTableMenuComponent: () => (/* binding */ ContactsTableMenuComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _static_data_contacts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../static-data/contacts */ 21374);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 90895);












function ContactsTableMenuComponent_ng_container_7_a_1_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-icon", 10);
  }
  if (rf & 2) {
    const item_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", item_r1.classes == null ? null : item_r1.classes.icon)("svgIcon", item_r1.icon);
  }
}
const _c0 = a0 => ({
  "bg-primary-600/10 text-primary-600": a0
});
function ContactsTableMenuComponent_ng_container_7_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactsTableMenuComponent_ng_container_7_a_1_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r8);
      const item_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r6.setFilter(item_r1.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ContactsTableMenuComponent_ng_container_7_a_1_mat_icon_1_Template, 1, 2, "mat-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("@fadeInRight", undefined)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](4, _c0, ctx_r2.isActive(item_r1.id)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r1.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r1.label);
  }
}
function ContactsTableMenuComponent_ng_container_7_h3_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h3", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("@fadeInRight", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", item_r1.label, " ");
  }
}
function ContactsTableMenuComponent_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ContactsTableMenuComponent_ng_container_7_a_1_Template, 4, 6, "a", 6)(2, ContactsTableMenuComponent_ng_container_7_h3_2_Template, 2, 2, "h3", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r1.type === "link");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r1.type === "subheading");
  }
}
class ContactsTableMenuComponent {
  constructor() {
    this.items = [{
      type: 'link',
      id: 'all',
      icon: 'mat:view_headline',
      label: 'All Contacts'
    }, {
      type: 'link',
      id: 'frequently',
      icon: 'mat:history',
      label: 'Frequently contacted'
    }, {
      type: 'link',
      id: 'starred',
      icon: 'mat:star',
      label: 'Starred'
    }, {
      type: 'subheading',
      label: 'Labels'
    }, {
      type: 'link',
      id: 'family',
      icon: 'mat:label',
      label: 'Family',
      classes: {
        icon: 'text-primary-600'
      }
    }, {
      type: 'link',
      id: 'friends',
      icon: 'mat:label',
      label: 'Friends',
      classes: {
        icon: 'text-green-600'
      }
    }, {
      type: 'link',
      id: 'colleagues',
      icon: 'mat:label',
      label: 'Colleagues',
      classes: {
        icon: 'text-amber-600'
      }
    }, {
      type: 'link',
      id: 'business',
      icon: 'mat:label',
      label: 'Business',
      classes: {
        icon: 'text-gray-600'
      }
    }];
    this.filterChange = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.openAddNew = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.activeCategory = 'all';
  }
  ngOnInit() {}
  setFilter(category) {
    this.activeCategory = category;
    if (category === 'starred') {
      return this.filterChange.emit(_static_data_contacts__WEBPACK_IMPORTED_MODULE_0__.contactsData.filter(c => c.starred));
    }
    if (category === 'all') {
      return this.filterChange.emit(_static_data_contacts__WEBPACK_IMPORTED_MODULE_0__.contactsData);
    }
    if (category === 'frequently' || category === 'family' || category === 'friends' || category === 'colleagues' || category === 'business') {
      return this.filterChange.emit([]);
    }
  }
  isActive(category) {
    return this.activeCategory === category;
  }
  static #_ = this.ɵfac = function ContactsTableMenuComponent_Factory(t) {
    return new (t || ContactsTableMenuComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: ContactsTableMenuComponent,
    selectors: [["vex-contacts-table-menu"]],
    inputs: {
      items: "items"
    },
    outputs: {
      filterChange: "filterChange",
      openAddNew: "openAddNew"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 8,
    vars: 2,
    consts: [[1, "max-w-3xs", "w-full"], [1, "h-14", "mb-6", "flex", "px-6", "sm:px-0", "flex", "items-center"], ["color", "primary", "mat-raised-button", "", "type", "button", 1, "flex-auto", 3, "click"], ["svgIcon", "mat:add", 1, "ltr:-ml-4", "ltr:mr-2", "rtl:ml-2", "icon-sm"], [1, "px-6", "sm:px-0"], [4, "ngFor", "ngForOf"], ["class", "rounded h-10 px-4 cursor-pointer hover:bg-primary-600/10 mt-1 font-medium flex items-center transition duration-200 ease-out", "matRipple", "", 3, "ngClass", "click", 4, "ngIf"], ["class", "caption text-secondary font-medium mb-0 mt-6", 4, "ngIf"], ["matRipple", "", 1, "rounded", "h-10", "px-4", "cursor-pointer", "hover:bg-primary-600/10", "mt-1", "font-medium", "flex", "items-center", "transition", "duration-200", "ease-out", 3, "ngClass", "click"], ["class", "ltr:mr-3 rtl:ml-3", 3, "ngClass", "svgIcon", 4, "ngIf"], [1, "ltr:mr-3", "rtl:ml-3", 3, "ngClass", "svgIcon"], [1, "caption", "text-secondary", "font-medium", "mb-0", "mt-6"]],
    template: function ContactsTableMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactsTableMenuComponent_Template_button_click_2_listener() {
          return ctx.openAddNew.emit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "mat-icon", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Add Contact");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, ContactsTableMenuComponent_ng_container_7_Template, 3, 2, "ng-container", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("@stagger", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.items);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgFor, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRipple, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass],
    encapsulation: 2,
    data: {
      animation: [_vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInRight400ms, _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_2__.stagger40ms]
    }
  });
}

/***/ }),

/***/ 15488:
/*!********************************************************************************!*\
  !*** ./src/app/pages/apps/contacts/contacts-table/contacts-table.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactsTableComponent: () => (/* binding */ ContactsTableComponent)
/* harmony export */ });
/* harmony import */ var _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/scale-in.animation */ 62008);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _static_data_contacts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../static-data/contacts */ 21374);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 50655);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _components_contacts_edit_contacts_edit_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/contacts-edit/contacts-edit.component */ 98808);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _contacts_data_table_contacts_data_table_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./contacts-data-table/contacts-data-table.component */ 41997);
/* harmony import */ var _contacts_table_menu_contacts_table_menu_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./contacts-table-menu/contacts-table-menu.component */ 20193);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/sidenav */ 31465);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/dialog */ 17401);



















class ContactsTableComponent {
  constructor(dialog) {
    this.dialog = dialog;
    this.searchCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_7__.UntypedFormControl();
    this.searchStr$ = this.searchCtrl.valueChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.debounceTime)(10));
    this.menuOpen = false;
    this.activeCategory = 'all';
    this.tableData = _static_data_contacts__WEBPACK_IMPORTED_MODULE_2__.contactsData;
    this.tableColumns = [{
      label: '',
      property: 'selected',
      type: 'checkbox',
      cssClasses: ['w-6']
    }, {
      label: '',
      property: 'imageSrc',
      type: 'image',
      cssClasses: ['min-w-9']
    }, {
      label: 'NAME',
      property: 'name',
      type: 'text',
      cssClasses: ['font-medium']
    }, {
      label: 'EMAIL',
      property: 'email',
      type: 'text',
      cssClasses: ['text-secondary']
    }, {
      label: 'PHONE',
      property: 'phone',
      type: 'text',
      cssClasses: ['text-secondary']
    }, {
      label: '',
      property: 'starred',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }, {
      label: '',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }];
  }
  ngOnInit() {}
  openContact(id) {
    this.dialog.open(_components_contacts_edit_contacts_edit_component__WEBPACK_IMPORTED_MODULE_4__.ContactsEditComponent, {
      data: id || null,
      width: '600px'
    });
  }
  toggleStar(id) {
    const contact = this.tableData.find(c => c.id === id);
    if (contact) {
      contact.starred = !contact.starred;
    }
  }
  setData(data) {
    this.tableData = data;
    this.menuOpen = false;
  }
  openMenu() {
    this.menuOpen = true;
  }
  static #_ = this.ɵfac = function ContactsTableComponent_Factory(t) {
    return new (t || ContactsTableComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: ContactsTableComponent,
    selectors: [["vex-contacts-table"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵStandaloneFeature"]],
    decls: 22,
    vars: 10,
    consts: [[1, "w-full", "h-full", "flex", "flex-col"], [1, "px-6", "pt-6", "pb-20", "bg-primary-600/10", "flex-none"], [1, "flex", "items-center", "container", "px-0"], ["mat-icon-button", "", "type", "button", 1, "sm:hidden", "text-on-primary-600", 3, "click"], ["svgIcon", "mat:menu"], [1, "display-1", "font-bold", "m-0", "flex", "items-center", "w-full", "max-w-3xs", "mr-6"], [1, "w-12", "h-12", "rounded-full", "text-primary-600", "ltr:mr-4", "rtl:ml-4", "bg-primary-600/10", "hidden", "sm:flex", "items-center", "justify-center"], ["svgIcon", "mat:contacts"], [1, "block"], [1, "hidden", "sm:flex", "items-center", "bg-foreground", "rounded-full", "overflow-hidden", "relative", "ltr:pl-5", "rtl:pr-5", "h-12", "max-w-md", "w-full", "shadow-xl", "mx-auto"], ["svgIcon", "mat:search", 1, "text-secondary", "flex-none"], ["placeholder", "Search Contacts...", "type", "text", 1, "border-0", "h-12", "outline-none", "ltr:pl-4", "rtl:pr-4", "placeholder:text-secondary", "bg-foreground", "flex-auto", 3, "formControl"], [1, "-mt-14", "pt-0", "overflow-hidden", "flex-1", "flex", "container", "px-0"], [1, "bg-transparent", "flex-auto", "flex"], ["mode", "over", 3, "opened", "openedChange"], [1, "sm:hidden", 3, "filterChange", "openAddNew"], [1, "p-6", "pt-0", "flex-auto", "flex", "items-start"], [1, "hidden", "sm:block", "ltr:mr-6", "rtl:ml-6", 3, "filterChange", "openAddNew"], [1, "card", "h-full", "overflow-hidden", "flex-auto"], [3, "columns", "data", "searchStr", "openContact", "toggleStar"]],
    template: function ContactsTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ContactsTableComponent_Template_button_click_3_listener() {
          return ctx.openMenu();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "h2", 5)(6, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](7, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](9, "Contacts");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](11, "mat-icon", 10)(12, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 12)(14, "mat-drawer-container", 13)(15, "mat-drawer", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("openedChange", function ContactsTableComponent_Template_mat_drawer_openedChange_15_listener($event) {
          return ctx.menuOpen = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "vex-contacts-table-menu", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("filterChange", function ContactsTableComponent_Template_vex_contacts_table_menu_filterChange_16_listener($event) {
          return ctx.setData($event);
        })("openAddNew", function ContactsTableComponent_Template_vex_contacts_table_menu_openAddNew_16_listener() {
          return ctx.openContact();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "mat-drawer-content", 16)(18, "vex-contacts-table-menu", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("filterChange", function ContactsTableComponent_Template_vex_contacts_table_menu_filterChange_18_listener($event) {
          return ctx.setData($event);
        })("openAddNew", function ContactsTableComponent_Template_vex_contacts_table_menu_openAddNew_18_listener() {
          return ctx.openContact();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "div", 18)(20, "vex-contacts-data-table", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("openContact", function ContactsTableComponent_Template_vex_contacts_data_table_openContact_20_listener($event) {
          return ctx.openContact($event);
        })("toggleStar", function ContactsTableComponent_Template_vex_contacts_data_table_toggleStar_20_listener($event) {
          return ctx.toggleStar($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](21, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formControl", ctx.searchCtrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("opened", ctx.menuOpen);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("columns", ctx.tableColumns)("data", ctx.tableData)("searchStr", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](21, 8, ctx.searchStr$));
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlDirective, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__.MatSidenavModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__.MatDrawer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__.MatDrawerContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__.MatDrawerContent, _contacts_table_menu_contacts_table_menu_component__WEBPACK_IMPORTED_MODULE_6__.ContactsTableMenuComponent, _contacts_data_table_contacts_data_table_component__WEBPACK_IMPORTED_MODULE_5__.ContactsDataTableComponent, _angular_common__WEBPACK_IMPORTED_MODULE_14__.AsyncPipe],
    styles: [".mat-drawer-container[_ngcontent-%COMP%] {\n        background: transparent !important;\n      }\n    \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9jb250YWN0cy9jb250YWN0cy10YWJsZS9jb250YWN0cy10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUNNO1FBQ0Usa0NBQWtDO01BQ3BDIiwic291cmNlc0NvbnRlbnQiOlsiXG4gICAgICAubWF0LWRyYXdlci1jb250YWluZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICJdLCJzb3VyY2VSb290IjoiIn0= */"],
    data: {
      animation: [_vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_3__.stagger40ms, _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_0__.scaleIn400ms, _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInRight400ms]
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_contacts_contacts-table_contacts-table_component_ts.js.map