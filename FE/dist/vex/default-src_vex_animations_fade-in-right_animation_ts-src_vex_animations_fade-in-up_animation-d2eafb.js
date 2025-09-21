"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["default-src_vex_animations_fade-in-right_animation_ts-src_vex_animations_fade-in-up_animation-d2eafb"],{

/***/ 95982:
/*!********************************************************!*\
  !*** ./src/@vex/animations/fade-in-right.animation.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fadeInRight400ms: () => (/* binding */ fadeInRight400ms),
/* harmony export */   fadeInRightAnimation: () => (/* binding */ fadeInRightAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function fadeInRightAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('fadeInRight', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateX(-20px)',
    opacity: 0
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateX(0)',
    opacity: 1
  }))])]);
}
const fadeInRight400ms = fadeInRightAnimation(400);

/***/ }),

/***/ 83951:
/*!*****************************************************!*\
  !*** ./src/@vex/animations/fade-in-up.animation.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fadeInUp400ms: () => (/* binding */ fadeInUp400ms),
/* harmony export */   fadeInUpAnimation: () => (/* binding */ fadeInUpAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function fadeInUpAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('fadeInUp', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateY(20px)',
    opacity: 0
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateY(0)',
    opacity: 1
  }))])]);
}
const fadeInUp400ms = fadeInUpAnimation(400);

/***/ }),

/***/ 2852:
/*!********************************************************!*\
  !*** ./src/@vex/animations/scale-fade-in.animation.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleFadeIn400ms: () => (/* binding */ scaleFadeIn400ms),
/* harmony export */   scaleFadeInAnimation: () => (/* binding */ scaleFadeInAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function scaleFadeInAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('scaleFadeIn', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'scale(0.8)',
    opacity: 0
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'scale(1)',
    opacity: 1
  }))])]);
}
const scaleFadeIn400ms = scaleFadeInAnimation(400);

/***/ }),

/***/ 62008:
/*!***************************************************!*\
  !*** ./src/@vex/animations/scale-in.animation.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleIn400ms: () => (/* binding */ scaleIn400ms),
/* harmony export */   scaleInAnimation: () => (/* binding */ scaleInAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function scaleInAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('scaleIn', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'scale(0)'
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'scale(1)'
  }))])]);
}
const scaleIn400ms = scaleInAnimation(400);

/***/ }),

/***/ 86820:
/*!**************************************************!*\
  !*** ./src/@vex/animations/stagger.animation.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stagger20ms: () => (/* binding */ stagger20ms),
/* harmony export */   stagger40ms: () => (/* binding */ stagger40ms),
/* harmony export */   stagger60ms: () => (/* binding */ stagger60ms),
/* harmony export */   stagger80ms: () => (/* binding */ stagger80ms),
/* harmony export */   staggerAnimation: () => (/* binding */ staggerAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function staggerAnimation(timing) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('stagger', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)('* => *', [
  // each time the binding value changes
  (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.query)(':enter', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.stagger)(timing, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animateChild)()), {
    optional: true
  })])]);
}
const stagger80ms = staggerAnimation(80);
const stagger60ms = staggerAnimation(60);
const stagger40ms = staggerAnimation(40);
const stagger20ms = staggerAnimation(20);

/***/ }),

/***/ 98808:
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/apps/contacts/components/contacts-edit/contacts-edit.component.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactsEditComponent: () => (/* binding */ ContactsEditComponent),
/* harmony export */   contactIdCounter: () => (/* binding */ contactIdCounter)
/* harmony export */ });
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _static_data_contacts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../static-data/contacts */ 21374);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/datepicker */ 82226);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/divider */ 69400);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);





















function ContactsEditComponent_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 36);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.contact == null ? null : ctx_r0.contact.imageSrc, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function ContactsEditComponent_mat_icon_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-icon", 37);
  }
}
function ContactsEditComponent_mat_icon_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-icon", 38);
  }
}
function ContactsEditComponent_ng_container_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Update Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
}
function ContactsEditComponent_ng_container_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Create Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
}
let contactIdCounter = 50;
class ContactsEditComponent {
  get isEdit() {
    return !!this.contactId;
  }
  constructor(contactId, dialogRef, fb) {
    this.contactId = contactId;
    this.dialogRef = dialogRef;
    this.fb = fb;
    this.form = this.fb.group({
      name: this.fb.control('', {
        nonNullable: true
      }),
      email: this.fb.control('', {
        nonNullable: true
      }),
      phone: this.fb.control('', {
        nonNullable: true
      }),
      company: this.fb.control('', {
        nonNullable: true
      }),
      notes: this.fb.control('', {
        nonNullable: true
      }),
      birthday: this.fb.control('', {
        nonNullable: true
      })
    });
  }
  ngOnInit() {
    if (this.contactId) {
      const contact = _static_data_contacts__WEBPACK_IMPORTED_MODULE_0__.contactsData.find(c => c.id === this.contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      this.contact = contact;
      this.form.patchValue(this.contact);
    }
  }
  toggleStar() {
    if (this.contact) {
      this.contact.starred = !this.contact.starred;
    }
  }
  save() {
    const form = this.form.getRawValue();
    if (!this.contact) {
      this.contact = {
        ...form,
        imageSrc: '',
        selected: false,
        starred: false,
        id: contactIdCounter++
      };
    }
    this.contact.name = form.name;
    this.contact.email = form.email;
    this.contact.phone = form.phone;
    this.contact.company = form.company;
    this.contact.notes = form.notes;
    this.contact.birthday = form.birthday;
    this.dialogRef.close();
  }
  static #_ = this.ɵfac = function ContactsEditComponent_Factory(t) {
    return new (t || ContactsEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ContactsEditComponent,
    selectors: [["vex-contacts-edit"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 65,
    vars: 10,
    consts: [[3, "formGroup", "ngSubmit"], ["mat-dialog-title", "", 1, "flex", "items-center"], ["class", "avatar ltr:mr-5 rtl:ml-5", 3, "src", 4, "ngIf"], [1, "headline", "m-0", "flex-auto"], ["mat-icon-button", "", "type", "button", 1, "text-secondary", 3, "click"], ["class", "text-amber-600", "svgIcon", "mat:star", 4, "ngIf"], ["svgIcon", "mat:star_border", 4, "ngIf"], ["mat-icon-button", "", "type", "button", 1, "text-secondary", 3, "matMenuTriggerFor"], ["svgIcon", "mat:more_vert"], ["mat-dialog-close", "", "mat-icon-button", "", "type", "button", 1, "text-secondary"], ["svgIcon", "mat:close"], [1, "text-border"], [1, "flex", "flex-col"], [1, "mt-6"], ["cdkFocusInitial", "", "formControlName", "name", "matInput", ""], ["matIconPrefix", "", "svgIcon", "mat:person"], ["formControlName", "phone", "matInput", ""], ["matIconPrefix", "", "svgIcon", "mat:phone"], ["formControlName", "email", "matInput", ""], ["matIconPrefix", "", "svgIcon", "mat:email"], ["formControlName", "company", "matInput", ""], ["matIconPrefix", "", "svgIcon", "mat:business"], ["formControlName", "birthday", "matInput", "", 3, "matDatepicker"], ["matIconPrefix", "", 1, "block", 3, "for"], ["datepickerRef", ""], ["formControlName", "notes", "matInput", ""], ["align", "end"], ["mat-button", "", "mat-dialog-close", "", "type", "button"], ["color", "primary", "mat-flat-button", "", "type", "submit"], [4, "ngIf"], ["xPosition", "before", "yPosition", "below"], ["settingsMenu", "matMenu"], ["mat-menu-item", ""], ["svgIcon", "mat:print"], ["svgIcon", "mat:download"], ["svgIcon", "mat:delete"], [1, "avatar", "ltr:mr-5", "rtl:ml-5", 3, "src"], ["svgIcon", "mat:star", 1, "text-amber-600"], ["svgIcon", "mat:star_border"]],
    template: function ContactsEditComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function ContactsEditComponent_Template_form_ngSubmit_0_listener() {
          return ctx.save();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, ContactsEditComponent_img_2_Template, 1, 1, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ContactsEditComponent_Template_button_click_5_listener() {
          return ctx.toggleStar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, ContactsEditComponent_mat_icon_6_Template, 1, 0, "mat-icon", 5)(7, ContactsEditComponent_mat_icon_7_Template, 1, 0, "mat-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "mat-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "mat-divider", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-dialog-content", 12)(14, "mat-form-field", 13)(15, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "input", 14)(18, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "mat-form-field")(20, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Phone");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "input", 16)(23, "mat-icon", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "mat-form-field")(25, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "E-Mail");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](27, "input", 18)(28, "mat-icon", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "mat-form-field")(30, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "Company");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](32, "input", 20)(33, "mat-icon", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "mat-form-field")(35, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "Birthday");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](37, "input", 22)(38, "mat-datepicker-toggle", 23)(39, "mat-datepicker", null, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "mat-form-field")(42, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "Notes");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](44, "textarea", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "mat-dialog-actions", 26)(46, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "button", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](49, ContactsEditComponent_ng_container_49_Template, 2, 0, "ng-container", 29)(50, ContactsEditComponent_ng_container_50_Template, 2, 0, "ng-container", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "mat-menu", 30, 31)(53, "button", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](54, "mat-icon", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](56, "Print");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "button", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](58, "mat-icon", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](60, "Export");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](61, "button", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](62, "mat-icon", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](63, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](64, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](40);
        const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](52);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.contact == null ? null : ctx.contact.imageSrc);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.form.controls.name.value || "New Contact", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.contact == null ? null : ctx.contact.starred);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !(ctx.contact == null ? null : ctx.contact.starred));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("matMenuTriggerFor", _r6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("matDatepicker", _r3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", _r3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isEdit);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isEdit);
      }
    },
    dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogClose, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogContent, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIcon, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenuTrigger, _angular_material_divider__WEBPACK_IMPORTED_MODULE_8__.MatDividerModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_8__.MatDivider, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__.MatPrefix, _angular_material_input__WEBPACK_IMPORTED_MODULE_10__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_10__.MatInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_11__.MatDatepickerModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_11__.MatDatepicker, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_11__.MatDatepickerInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_11__.MatDatepickerToggle],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 21374:
/*!*************************************!*\
  !*** ./src/static-data/contacts.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contactsData: () => (/* binding */ contactsData)
/* harmony export */ });
const contactsData = [{
  id: 1,
  imageSrc: 'assets/img/avatars/1.jpg',
  name: 'Guerrero Morales',
  phone: '+21 (988) 504-2559',
  company: 'Supportal',
  email: 'guerrero.morales@supportal.com',
  selected: false,
  starred: false
}, {
  id: 2,
  imageSrc: 'assets/img/avatars/2.jpg',
  name: 'Robin Blackburn',
  phone: '+5 (911) 423-2538',
  company: 'Polarax',
  email: 'robin.blackburn@polarax.biz',
  selected: false,
  starred: false
}, {
  id: 3,
  imageSrc: 'assets/img/avatars/3.jpg',
  name: 'Simone Gallegos',
  phone: '+2 (948) 573-3528',
  company: 'Applidec',
  email: 'simone.gallegos@applidec.org',
  selected: false,
  starred: true
}, {
  id: 4,
  imageSrc: 'assets/img/avatars/4.jpg',
  name: 'Bonner Mcmillan',
  phone: '+13 (932) 426-2309',
  company: 'Magneato',
  email: 'bonner.mcmillan@magneato.io',
  selected: false,
  starred: false
}, {
  id: 5,
  imageSrc: 'assets/img/avatars/5.jpg',
  name: 'Velasquez Spence',
  phone: '+31 (850) 492-2858',
  company: 'Joviold',
  email: 'velasquez.spence@joviold.co.uk',
  selected: false,
  starred: false
}, {
  id: 6,
  imageSrc: 'assets/img/avatars/6.jpg',
  name: 'Orr Fernandez',
  phone: '+6 (843) 490-2487',
  company: 'Accuprint',
  email: 'orr.fernandez@accuprint.tv',
  selected: false,
  starred: false
}, {
  id: 7,
  imageSrc: 'assets/img/avatars/7.jpg',
  name: 'Marcella Russo',
  phone: '+48 (836) 506-2890',
  company: 'Paprikut',
  email: 'marcella.russo@paprikut.name',
  selected: false,
  starred: true
}, {
  id: 8,
  imageSrc: 'assets/img/avatars/8.jpg',
  name: 'Mccormick Ferguson',
  phone: '+8 (957) 553-2497',
  company: 'Waab',
  email: 'mccormick.ferguson@waab.info',
  selected: false,
  starred: false
}, {
  id: 9,
  imageSrc: 'assets/img/avatars/9.jpg',
  name: 'Myrtle Walters',
  phone: '+29 (846) 562-3339',
  company: 'Hinway',
  email: 'myrtle.walters@hinway.me',
  selected: false,
  starred: false
}, {
  id: 10,
  imageSrc: 'assets/img/avatars/10.jpg',
  name: 'Rachael Griffin',
  phone: '+26 (827) 437-3065',
  company: 'Callflex',
  email: 'rachael.griffin@callflex.net',
  selected: false,
  starred: false
}, {
  id: 11,
  imageSrc: 'assets/img/avatars/11.jpg',
  name: 'Carney Emerson',
  phone: '+24 (821) 560-2716',
  company: 'Motovate',
  email: 'carney.emerson@motovate.ca',
  selected: false,
  starred: false
}, {
  id: 12,
  imageSrc: 'assets/img/avatars/12.jpg',
  name: 'Katrina Cooke',
  phone: '+10 (904) 524-2485',
  company: 'Quarex',
  email: 'katrina.cooke@quarex.biz',
  selected: false,
  starred: true
}, {
  id: 13,
  imageSrc: 'assets/img/avatars/13.jpg',
  name: 'Valdez Branch',
  phone: '+12 (941) 536-2874',
  company: 'Uniworld',
  email: 'valdez.branch@uniworld.com',
  selected: false,
  starred: false
}, {
  id: 14,
  imageSrc: 'assets/img/avatars/14.jpg',
  name: 'Dejesus Rogers',
  phone: '+40 (806) 435-2871',
  company: 'Oronoko',
  email: 'dejesus.rogers@oronoko.biz',
  selected: false,
  starred: false
}, {
  id: 15,
  imageSrc: 'assets/img/avatars/15.jpg',
  name: 'Horton Levy',
  phone: '+19 (932) 552-3976',
  company: 'Zensus',
  email: 'horton.levy@zensus.org',
  selected: false,
  starred: false
}, {
  id: 16,
  imageSrc: 'assets/img/avatars/16.jpg',
  name: 'Ivy Mays',
  phone: '+15 (919) 430-3795',
  company: 'Letpro',
  email: 'ivy.mays@letpro.io',
  selected: false,
  starred: false
}, {
  id: 17,
  imageSrc: 'assets/img/avatars/17.jpg',
  name: 'Butler Larsen',
  phone: '+18 (862) 489-2364',
  company: 'Micronaut',
  email: 'butler.larsen@micronaut.co.uk',
  selected: false,
  starred: true
}, {
  id: 18,
  imageSrc: 'assets/img/avatars/18.jpg',
  name: 'Jimmie Clements',
  phone: '+34 (946) 451-3718',
  company: 'Sarasonic',
  email: 'jimmie.clements@sarasonic.tv',
  selected: false,
  starred: true
}, {
  id: 19,
  imageSrc: 'assets/img/avatars/19.jpg',
  name: 'Kasey Rosa',
  phone: '+44 (910) 404-3456',
  company: 'Cytrak',
  email: 'kasey.rosa@cytrak.name',
  selected: false,
  starred: false
}, {
  id: 20,
  imageSrc: 'assets/img/avatars/20.jpg',
  name: 'Emily Schneider',
  phone: '+40 (870) 564-3250',
  company: 'Noralex',
  email: 'emily.schneider@noralex.info',
  selected: false,
  starred: false
}, {
  id: 21,
  imageSrc: 'assets/img/avatars/20.jpg',
  name: 'Lara Witt',
  phone: '+29 (971) 550-3793',
  company: 'Moltonic',
  email: 'lara.witt@moltonic.me',
  selected: false,
  starred: true
}, {
  id: 22,
  imageSrc: 'assets/img/avatars/19.jpg',
  name: 'Hebert Bailey',
  phone: '+4 (884) 527-3408',
  company: 'Homelux',
  email: 'hebert.bailey@homelux.net',
  selected: false,
  starred: true
}, {
  id: 23,
  imageSrc: 'assets/img/avatars/18.jpg',
  name: 'Lynda Garza',
  phone: '+44 (872) 404-3519',
  company: 'Quonk',
  email: 'lynda.garza@quonk.ca',
  selected: false,
  starred: true
}, {
  id: 24,
  imageSrc: 'assets/img/avatars/17.jpg',
  name: 'Stark Fitzgerald',
  phone: '+7 (999) 438-2471',
  company: 'Farmage',
  email: 'stark.fitzgerald@farmage.biz',
  selected: false,
  starred: true
}, {
  id: 25,
  imageSrc: 'assets/img/avatars/16.jpg',
  name: 'Karla Atkins',
  phone: '+44 (869) 502-3263',
  company: 'Kiggle',
  email: 'karla.atkins@kiggle.com',
  selected: false,
  starred: false
}, {
  id: 26,
  imageSrc: 'assets/img/avatars/15.jpg',
  name: 'Wilkerson Beasley',
  phone: '+29 (889) 462-3929',
  company: 'Naxdis',
  email: 'wilkerson.beasley@naxdis.biz',
  selected: false,
  starred: false
}, {
  id: 27,
  imageSrc: 'assets/img/avatars/14.jpg',
  name: 'Webb Stark',
  phone: '+38 (864) 482-2108',
  company: 'Equitax',
  email: 'webb.stark@equitax.org',
  selected: false,
  starred: true
}, {
  id: 28,
  imageSrc: 'assets/img/avatars/13.jpg',
  name: 'Courtney Barrett',
  phone: '+6 (828) 438-3288',
  company: 'Magnemo',
  email: 'courtney.barrett@magnemo.io',
  selected: false,
  starred: false
}, {
  id: 29,
  imageSrc: 'assets/img/avatars/12.jpg',
  name: 'Joanne Anderson',
  phone: '+27 (994) 435-2952',
  company: 'Extragene',
  email: 'joanne.anderson@extragene.co.uk',
  selected: false,
  starred: false
}, {
  id: 30,
  imageSrc: 'assets/img/avatars/11.jpg',
  name: 'Hampton Golden',
  phone: '+1 (967) 549-3561',
  company: 'Accupharm',
  email: 'hampton.golden@accupharm.tv',
  selected: false,
  starred: true
}, {
  id: 31,
  imageSrc: 'assets/img/avatars/10.jpg',
  name: 'Becker Mejia',
  phone: '+16 (971) 587-3994',
  company: 'Zillacom',
  email: 'becker.mejia@zillacom.name',
  selected: false,
  starred: true
}, {
  id: 32,
  imageSrc: 'assets/img/avatars/9.jpg',
  name: 'Marks Benton',
  phone: '+25 (961) 567-2085',
  company: 'Emoltra',
  email: 'marks.benton@emoltra.info',
  selected: false,
  starred: true
}, {
  id: 33,
  imageSrc: 'assets/img/avatars/8.jpg',
  name: 'Mai Wade',
  phone: '+23 (970) 419-3433',
  company: 'Senmao',
  email: 'mai.wade@senmao.me',
  selected: false,
  starred: false
}, {
  id: 34,
  imageSrc: 'assets/img/avatars/7.jpg',
  name: 'Maldonado Moran',
  phone: '+6 (912) 523-3028',
  company: 'Autograte',
  email: 'maldonado.moran@autograte.net',
  selected: false,
  starred: true
}, {
  id: 35,
  imageSrc: 'assets/img/avatars/6.jpg',
  name: 'Jaclyn Maxwell',
  phone: '+39 (988) 424-2719',
  company: 'Ecratic',
  email: 'jaclyn.maxwell@ecratic.ca',
  selected: false,
  starred: false
}, {
  id: 36,
  imageSrc: 'assets/img/avatars/5.jpg',
  name: 'Carmela Barron',
  phone: '+44 (932) 469-3459',
  company: 'Xinware',
  email: 'carmela.barron@xinware.biz',
  selected: false,
  starred: false
}, {
  id: 37,
  imageSrc: 'assets/img/avatars/4.jpg',
  name: 'Araceli Velasquez',
  phone: '+43 (965) 579-3919',
  company: 'Capscreen',
  email: 'araceli.velasquez@capscreen.com',
  selected: false,
  starred: false
}, {
  id: 38,
  imageSrc: 'assets/img/avatars/3.jpg',
  name: 'Gonzales Randolph',
  phone: '+23 (951) 574-3150',
  company: 'Ronbert',
  email: 'gonzales.randolph@ronbert.biz',
  selected: false,
  starred: true
}, {
  id: 39,
  imageSrc: 'assets/img/avatars/2.jpg',
  name: 'Ramirez Burt',
  phone: '+24 (963) 484-3465',
  company: 'Quizmo',
  email: 'ramirez.burt@quizmo.org',
  selected: false,
  starred: false
}, {
  id: 40,
  imageSrc: 'assets/img/avatars/1.jpg',
  name: 'Jessica Frenz',
  phone: '+49 (332) 45-4234',
  company: 'Bongo',
  email: 'jessica.frenz@bongo.com',
  selected: false,
  starred: false
}];

/***/ })

}]);
//# sourceMappingURL=default-src_vex_animations_fade-in-right_animation_ts-src_vex_animations_fade-in-up_animation-d2eafb.js.map