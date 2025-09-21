"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_mail_mail_routes_ts"],{

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

/***/ 32337:
/*!**************************************************************!*\
  !*** ./src/@vex/pipes/vex-strip-html/vex-strip-html.pipe.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexStripHtmlPipe: () => (/* binding */ VexStripHtmlPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

class VexStripHtmlPipe {
  transform(html) {
    if (!html) {
      return '';
    }
    return html?.replace(/<[^>]*>?/gm, '');
  }
  static #_ = this.ɵfac = function VexStripHtmlPipe_Factory(t) {
    return new (t || VexStripHtmlPipe)();
  };
  static #_2 = this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
    name: "vexStripHtml",
    type: VexStripHtmlPipe,
    pure: true,
    standalone: true
  });
}

/***/ }),

/***/ 21662:
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/apps/mail/components/mail-attachment/mail-attachment.component.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailAttachmentComponent: () => (/* binding */ MailAttachmentComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);


function MailAttachmentComponent_img_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 4);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r0.attachment.imgUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function MailAttachmentComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5)(1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.attachment.type, " ");
  }
}
class MailAttachmentComponent {
  constructor() {}
  ngOnInit() {}
  isImage() {
    return this.attachment?.type === 'png' || this.attachment?.type === 'jpg' || this.attachment?.type === 'gif' || this.attachment?.type === 'jpe';
  }
  static #_ = this.ɵfac = function MailAttachmentComponent_Factory(t) {
    return new (t || MailAttachmentComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MailAttachmentComponent,
    selectors: [["vex-mail-attachment"]],
    inputs: {
      attachment: "attachment"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 5,
    vars: 3,
    consts: [["class", "h-full w-full object-fit", 3, "src", 4, "ngIf"], ["class", "h-full w-full flex justify-center items-center p-4", 4, "ngIf"], [1, "vex-mail-attachment-overlay"], [1, "truncate"], [1, "h-full", "w-full", "object-fit", 3, "src"], [1, "h-full", "w-full", "flex", "justify-center", "items-center", "p-4"], [1, "p-2", "shadow", "bg-foreground", "rounded-full", "text-lg", "select-none"]],
    template: function MailAttachmentComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, MailAttachmentComponent_img_0_Template, 1, 1, "img", 0)(1, MailAttachmentComponent_div_1_Template, 3, 1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2)(3, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.isImage());
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.isImage());
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.attachment.label);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf],
    styles: ["[_nghost-%COMP%] {\n  max-width: 100%;\n  width: 190px;\n  height: 120px;\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n  border-radius: var(--vex-border-radius);\n  border-width: 1px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-background-app-bar-rgb) / var(--tw-bg-opacity));\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n[_nghost-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.6);\n}\n\n.vex-mail-attachment-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0px;\n  left: 0px;\n  right: 0px;\n  display: flex;\n  height: 100%;\n  width: 100%;\n  cursor: pointer;\n  flex-direction: column;\n  justify-content: flex-end;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: var(--vex-border-radius);\n  padding: 0.5rem;\n  font-size: 0.625rem;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  background: linear-gradient(to bottom, transparent, transparent 40%, rgba(0, 0, 0, 0.6));\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbXBvbmVudHMvbWFpbC1hdHRhY2htZW50L21haWwtYXR0YWNobWVudC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLGtCQUFBO0VBQUEscUJBQUE7RUFBQSxnQkFBQTtFQUFBLHVDQUFBO0VBQUEsaUJBQUE7RUFBQSxrQkFBQTtFQUFBLCtFQUFBO0VBQUEsZ0tBQUE7RUFBQSx3SkFBQTtFQUFBLGlMQUFBO0VBQUEsMEJBQUE7RUFBQSx3REFBQTtBQUNGOztBQUVBO0VBQ0UsOEJBQUE7QUFDRjs7QUFHRTtFQUFBLGtCQUFBO0VBQUEsV0FBQTtFQUFBLFNBQUE7RUFBQSxVQUFBO0VBQUEsYUFBQTtFQUFBLFlBQUE7RUFBQSxXQUFBO0VBQUEsZUFBQTtFQUFBLHNCQUFBO0VBQUEseUJBQUE7RUFBQSxnQkFBQTtFQUFBLHVCQUFBO0VBQUEsbUJBQUE7RUFBQSx1Q0FBQTtFQUFBLGVBQUE7RUFBQSxtQkFBQTtFQUFBLG9CQUFBO0VBQUEsZ0RBQUE7RUFBQSxnS0FBQTtFQUFBLHdKQUFBO0VBQUEsaUxBQUE7RUFBQSwwQkFBQTtFQUFBLHdEQUFBO0VBQ0E7QUFEQSIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICB3aWR0aDogMTkwcHg7XG4gIGhlaWdodDogMTIwcHg7XG4gIEBhcHBseSBpbmxpbmUtYmxvY2sgcm91bmRlZCBib3JkZXIgYmctYXBwLWJhciByZWxhdGl2ZSB0cmFuc2l0aW9uIGVhc2UtaW4tb3V0IGR1cmF0aW9uLTIwMCBvdmVyZmxvdy1oaWRkZW47XG59XG5cbjpob3N0KDpob3Zlcikge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNik7XG59XG5cbi52ZXgtbWFpbC1hdHRhY2htZW50LW92ZXJsYXkge1xuICBAYXBwbHkgYWJzb2x1dGUgYm90dG9tLTAgbGVmdC0wIHJpZ2h0LTAgdy1mdWxsIGgtZnVsbCBwLTIgdGV4dC13aGl0ZSB0ZXh0LTJ4cyBmbGV4IGZsZXgtY29sIGp1c3RpZnktZW5kIHRydW5jYXRlIHJvdW5kZWQgdHJhbnNpdGlvbiBlYXNlLWluLW91dCBkdXJhdGlvbi0yMDAgY3Vyc29yLXBvaW50ZXI7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudChcbiAgICAgIHRvIGJvdHRvbSxcbiAgICAgIHRyYW5zcGFyZW50LFxuICAgICAgdHJhbnNwYXJlbnQgNDAlLFxuICAgICAgcmdiYSgwLCAwLCAwLCAwLjYpXG4gICk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 59666:
/*!***********************************************************************************!*\
  !*** ./src/app/pages/apps/mail/components/mail-compose/mail-compose.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailComposeComponent: () => (/* binding */ MailComposeComponent)
/* harmony export */ });
/* harmony import */ var _vex_animations_dropdown_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/dropdown.animation */ 93943);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var ngx_quill__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-quill */ 70945);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);

















const _c0 = () => ({
  flex: "1 1 auto",
  display: "flex",
  "flex-direction": "column"
});
class MailComposeComponent {
  constructor(cd, dialogRef) {
    this.cd = cd;
    this.dialogRef = dialogRef;
    this.dropdownOpen = false;
  }
  ngOnInit() {}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cd.markForCheck();
  }
  submit() {
    this.dialogRef.close();
  }
  static #_ = this.ɵfac = function MailComposeComponent_Factory(t) {
    return new (t || MailComposeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: MailComposeComponent,
    selectors: [["vex-mail-compose"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 53,
    vars: 3,
    consts: [["mat-dialog-title", "", 1, "flex", "items-center"], [1, "flex-auto", "text-lg", "font-medium"], ["mat-dialog-close", "", "mat-icon-button", "", "type", "button"], ["svgIcon", "mat:close"], [1, "block", "w-full"], ["cdkFocusInitial", "", "matInput", "", "type", "text"], ["color", "primary", "mat-button", "", "matIconSuffix", "", "type", "button", 3, "click"], [1, "overflow-hidden"], ["matInput", "", "type", "text"], [1, "vex-mail-compose-editor", "flex", "flex-col"], [1, "flex-auto", "flex", "flex-col", "border", "rounded", 3, "styles"], ["matRipple", "", 1, "vex-mail-compose-attachment", "mt-4", "mb-2", "rounded-full", "border", "px-4", "py-1", "flex", "items-center", "hover:bg-hover", "transition", "duration-200", "ease-in-out", "cursor-pointer", "relative"], ["svgIcon", "mat:picture_as_pdf", 1, "flex-none", "text-primary-600", "icon-sm"], [1, "flex-auto", "ml-4", "text-sm"], [1, "text-sm", "text-secondary", "mr-2", "flex-none"], ["mat-icon-button", "", "type", "button", 1, "flex-none", "w-8", "h-8", "p-0", "leading-none", 3, "click"], ["svgIcon", "mat:close", 1, "icon-sm"], ["matRipple", "", 1, "vex-mail-compose-attachment", "my-2", "rounded-full", "border", "px-4", "py-1", "flex", "items-center", "hover:bg-hover", "transition", "duration-200", "ease-in-out", "cursor-pointer", "relative"], ["svgIcon", "mat:image", 1, "flex-none", "text-primary-600", "icon-sm"], ["color", "warn", "mat-dialog-close", "", "mat-icon-button", "", "matTooltip", "Discard Draft", "type", "button"], ["svgIcon", "mat:delete"], [1, "flex-1"], ["mat-icon-button", "", "matTooltip", "Attach File", "type", "button"], ["svgIcon", "mat:attach_file"], ["color", "primary", "mat-flat-button", "", "type", "button", 3, "click"], ["svgIcon", "mat:send", 1, "ml-2", "icon-sm"]],
    template: function MailComposeComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "p", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "New Message");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "mat-icon", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-dialog-content")(6, "mat-form-field", 4)(7, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "To");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MailComposeComponent_Template_button_click_10_listener() {
          return ctx.toggleDropdown();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, " CC/BCC ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 7)(13, "mat-form-field", 4)(14, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Cc");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "mat-form-field", 4)(18, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Bcc");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](20, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-form-field", 4)(22, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Subject");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "quill-editor", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "super-secret-design-document.pdf");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "p", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "54kb");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MailComposeComponent_Template_button_click_33_listener($event) {
          return $event.stopPropagation();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](34, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](36, "mat-icon", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, "cute-cat-picture.jpg");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "p", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](40, "16kb");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MailComposeComponent_Template_button_click_41_listener($event) {
          return $event.stopPropagation();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](42, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "mat-dialog-actions")(44, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](45, "mat-icon", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](46, "span", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](48, "mat-icon", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](49, "button", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MailComposeComponent_Template_button_click_49_listener() {
          return ctx.submit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51, "Send");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](52, "mat-icon", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("@dropdown", ctx.dropdownOpen);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("styles", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](2, _c0));
      }
    },
    dependencies: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogClose, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogContent, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInput, ngx_quill__WEBPACK_IMPORTED_MODULE_7__.QuillEditorComponent, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatRipple, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_9__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_9__.MatTooltip],
    styles: ["/*!\n * Quill Editor v1.3.7\n * https://quilljs.com/\n * Copyright (c) 2014, Jason Chen\n * Copyright (c) 2013, salesforce.com\n */\n.ql-container {\n  box-sizing: border-box;\n  font-family: Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  height: 100%;\n  margin: 0px;\n  position: relative;\n}\n.ql-container.ql-disabled .ql-tooltip {\n  visibility: hidden;\n}\n.ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {\n  pointer-events: none;\n}\n.ql-clipboard {\n  left: -100000px;\n  height: 1px;\n  overflow-y: hidden;\n  position: absolute;\n  top: 50%;\n}\n.ql-clipboard p {\n  margin: 0;\n  padding: 0;\n}\n.ql-editor {\n  box-sizing: border-box;\n  line-height: 1.42;\n  height: 100%;\n  outline: none;\n  overflow-y: auto;\n  padding: 12px 15px;\n  tab-size: 4;\n  -moz-tab-size: 4;\n  text-align: left;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n.ql-editor > * {\n  cursor: text;\n}\n.ql-editor p,\n.ql-editor ol,\n.ql-editor ul,\n.ql-editor pre,\n.ql-editor blockquote,\n.ql-editor h1,\n.ql-editor h2,\n.ql-editor h3,\n.ql-editor h4,\n.ql-editor h5,\n.ql-editor h6 {\n  margin: 0;\n  padding: 0;\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol,\n.ql-editor ul {\n  padding-left: 1.5em;\n}\n.ql-editor ol > li,\n.ql-editor ul > li {\n  list-style-type: none;\n}\n.ql-editor ul > li::before {\n  content: '\\2022';\n}\n.ql-editor ul[data-checked=true],\n.ql-editor ul[data-checked=false] {\n  pointer-events: none;\n}\n.ql-editor ul[data-checked=true] > li *,\n.ql-editor ul[data-checked=false] > li * {\n  pointer-events: all;\n}\n.ql-editor ul[data-checked=true] > li::before,\n.ql-editor ul[data-checked=false] > li::before {\n  color: #777;\n  cursor: pointer;\n  pointer-events: all;\n}\n.ql-editor ul[data-checked=true] > li::before {\n  content: '\\2611';\n}\n.ql-editor ul[data-checked=false] > li::before {\n  content: '\\2610';\n}\n.ql-editor li::before {\n  display: inline-block;\n  white-space: nowrap;\n  width: 1.2em;\n}\n.ql-editor li:not(.ql-direction-rtl)::before {\n  margin-left: -1.5em;\n  margin-right: 0.3em;\n  text-align: right;\n}\n.ql-editor li.ql-direction-rtl::before {\n  margin-left: 0.3em;\n  margin-right: -1.5em;\n}\n.ql-editor ol li:not(.ql-direction-rtl),\n.ql-editor ul li:not(.ql-direction-rtl) {\n  padding-left: 1.5em;\n}\n.ql-editor ol li.ql-direction-rtl,\n.ql-editor ul li.ql-direction-rtl {\n  padding-right: 1.5em;\n}\n.ql-editor ol li {\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n  counter-increment: list-0;\n}\n.ql-editor ol li:before {\n  content: counter(list-0, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-1 {\n  counter-increment: list-1;\n}\n.ql-editor ol li.ql-indent-1:before {\n  content: counter(list-1, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-1 {\n  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-2 {\n  counter-increment: list-2;\n}\n.ql-editor ol li.ql-indent-2:before {\n  content: counter(list-2, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-2 {\n  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-3 {\n  counter-increment: list-3;\n}\n.ql-editor ol li.ql-indent-3:before {\n  content: counter(list-3, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-3 {\n  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-4 {\n  counter-increment: list-4;\n}\n.ql-editor ol li.ql-indent-4:before {\n  content: counter(list-4, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-4 {\n  counter-reset: list-5 list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-5 {\n  counter-increment: list-5;\n}\n.ql-editor ol li.ql-indent-5:before {\n  content: counter(list-5, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-5 {\n  counter-reset: list-6 list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-6 {\n  counter-increment: list-6;\n}\n.ql-editor ol li.ql-indent-6:before {\n  content: counter(list-6, decimal) '. ';\n}\n.ql-editor ol li.ql-indent-6 {\n  counter-reset: list-7 list-8 list-9;\n}\n.ql-editor ol li.ql-indent-7 {\n  counter-increment: list-7;\n}\n.ql-editor ol li.ql-indent-7:before {\n  content: counter(list-7, lower-alpha) '. ';\n}\n.ql-editor ol li.ql-indent-7 {\n  counter-reset: list-8 list-9;\n}\n.ql-editor ol li.ql-indent-8 {\n  counter-increment: list-8;\n}\n.ql-editor ol li.ql-indent-8:before {\n  content: counter(list-8, lower-roman) '. ';\n}\n.ql-editor ol li.ql-indent-8 {\n  counter-reset: list-9;\n}\n.ql-editor ol li.ql-indent-9 {\n  counter-increment: list-9;\n}\n.ql-editor ol li.ql-indent-9:before {\n  content: counter(list-9, decimal) '. ';\n}\n.ql-editor .ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 3em;\n}\n.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 4.5em;\n}\n.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 3em;\n}\n.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 4.5em;\n}\n.ql-editor .ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 6em;\n}\n.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 7.5em;\n}\n.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 6em;\n}\n.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 7.5em;\n}\n.ql-editor .ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 9em;\n}\n.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 10.5em;\n}\n.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 9em;\n}\n.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 10.5em;\n}\n.ql-editor .ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 12em;\n}\n.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 13.5em;\n}\n.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 12em;\n}\n.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 13.5em;\n}\n.ql-editor .ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 15em;\n}\n.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 16.5em;\n}\n.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 15em;\n}\n.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 16.5em;\n}\n.ql-editor .ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 18em;\n}\n.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 19.5em;\n}\n.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 18em;\n}\n.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 19.5em;\n}\n.ql-editor .ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 21em;\n}\n.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 22.5em;\n}\n.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 21em;\n}\n.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 22.5em;\n}\n.ql-editor .ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 24em;\n}\n.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 25.5em;\n}\n.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 24em;\n}\n.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 25.5em;\n}\n.ql-editor .ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 27em;\n}\n.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 28.5em;\n}\n.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 27em;\n}\n.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 28.5em;\n}\n.ql-editor .ql-video {\n  display: block;\n  max-width: 100%;\n}\n.ql-editor .ql-video.ql-align-center {\n  margin: 0 auto;\n}\n.ql-editor .ql-video.ql-align-right {\n  margin: 0 0 0 auto;\n}\n.ql-editor .ql-bg-black {\n  background-color: #000;\n}\n.ql-editor .ql-bg-red {\n  background-color: #e60000;\n}\n.ql-editor .ql-bg-orange {\n  background-color: #f90;\n}\n.ql-editor .ql-bg-yellow {\n  background-color: #ff0;\n}\n.ql-editor .ql-bg-green {\n  background-color: #008a00;\n}\n.ql-editor .ql-bg-blue {\n  background-color: #06c;\n}\n.ql-editor .ql-bg-purple {\n  background-color: #93f;\n}\n.ql-editor .ql-color-white {\n  color: #fff;\n}\n.ql-editor .ql-color-red {\n  color: #e60000;\n}\n.ql-editor .ql-color-orange {\n  color: #f90;\n}\n.ql-editor .ql-color-yellow {\n  color: #ff0;\n}\n.ql-editor .ql-color-green {\n  color: #008a00;\n}\n.ql-editor .ql-color-blue {\n  color: #06c;\n}\n.ql-editor .ql-color-purple {\n  color: #93f;\n}\n.ql-editor .ql-font-serif {\n  font-family: Georgia, Times New Roman, serif;\n}\n.ql-editor .ql-font-monospace {\n  font-family: Monaco, Courier New, monospace;\n}\n.ql-editor .ql-size-small {\n  font-size: 0.75em;\n}\n.ql-editor .ql-size-large {\n  font-size: 1.5em;\n}\n.ql-editor .ql-size-huge {\n  font-size: 2.5em;\n}\n.ql-editor .ql-direction-rtl {\n  direction: rtl;\n  text-align: inherit;\n}\n.ql-editor .ql-align-center {\n  text-align: center;\n}\n.ql-editor .ql-align-justify {\n  text-align: justify;\n}\n.ql-editor .ql-align-right {\n  text-align: right;\n}\n.ql-editor.ql-blank::before {\n  color: rgba(0,0,0,0.6);\n  content: attr(data-placeholder);\n  font-style: italic;\n  left: 15px;\n  pointer-events: none;\n  position: absolute;\n  right: 15px;\n}\n.ql-snow.ql-toolbar:after,\n.ql-snow .ql-toolbar:after {\n  clear: both;\n  content: '';\n  display: table;\n}\n.ql-snow.ql-toolbar button,\n.ql-snow .ql-toolbar button {\n  background: none;\n  border: none;\n  cursor: pointer;\n  display: inline-block;\n  float: left;\n  height: 24px;\n  padding: 3px 5px;\n  width: 28px;\n}\n.ql-snow.ql-toolbar button svg,\n.ql-snow .ql-toolbar button svg {\n  float: left;\n  height: 100%;\n}\n.ql-snow.ql-toolbar button:active:hover,\n.ql-snow .ql-toolbar button:active:hover {\n  outline: none;\n}\n.ql-snow.ql-toolbar input.ql-image[type=file],\n.ql-snow .ql-toolbar input.ql-image[type=file] {\n  display: none;\n}\n.ql-snow.ql-toolbar button:hover,\n.ql-snow .ql-toolbar button:hover,\n.ql-snow.ql-toolbar button:focus,\n.ql-snow .ql-toolbar button:focus,\n.ql-snow.ql-toolbar button.ql-active,\n.ql-snow .ql-toolbar button.ql-active,\n.ql-snow.ql-toolbar .ql-picker-label:hover,\n.ql-snow .ql-toolbar .ql-picker-label:hover,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active,\n.ql-snow.ql-toolbar .ql-picker-item:hover,\n.ql-snow .ql-toolbar .ql-picker-item:hover,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected {\n  color: #06c;\n}\n.ql-snow.ql-toolbar button:hover .ql-fill,\n.ql-snow .ql-toolbar button:hover .ql-fill,\n.ql-snow.ql-toolbar button:focus .ql-fill,\n.ql-snow .ql-toolbar button:focus .ql-fill,\n.ql-snow.ql-toolbar button.ql-active .ql-fill,\n.ql-snow .ql-toolbar button.ql-active .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,\n.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {\n  fill: #06c;\n}\n.ql-snow.ql-toolbar button:hover .ql-stroke,\n.ql-snow .ql-toolbar button:hover .ql-stroke,\n.ql-snow.ql-toolbar button:focus .ql-stroke,\n.ql-snow .ql-toolbar button:focus .ql-stroke,\n.ql-snow.ql-toolbar button.ql-active .ql-stroke,\n.ql-snow .ql-toolbar button.ql-active .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,\n.ql-snow.ql-toolbar button:hover .ql-stroke-miter,\n.ql-snow .ql-toolbar button:hover .ql-stroke-miter,\n.ql-snow.ql-toolbar button:focus .ql-stroke-miter,\n.ql-snow .ql-toolbar button:focus .ql-stroke-miter,\n.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,\n.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,\n.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,\n.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,\n.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,\n.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,\n.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,\n.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,\n.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,\n.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {\n  stroke: #06c;\n}\n@media (pointer: coarse) {\n  .ql-snow.ql-toolbar button:hover:not(.ql-active),\n  .ql-snow .ql-toolbar button:hover:not(.ql-active) {\n    color: #444;\n  }\n  .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,\n  .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,\n  .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,\n  .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {\n    fill: #444;\n  }\n  .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,\n  .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,\n  .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,\n  .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {\n    stroke: #444;\n  }\n}\n.ql-snow {\n  box-sizing: border-box;\n}\n.ql-snow * {\n  box-sizing: border-box;\n}\n.ql-snow .ql-hidden {\n  display: none;\n}\n.ql-snow .ql-out-bottom,\n.ql-snow .ql-out-top {\n  visibility: hidden;\n}\n.ql-snow .ql-tooltip {\n  position: absolute;\n  transform: translateY(10px);\n}\n.ql-snow .ql-tooltip a {\n  cursor: pointer;\n  text-decoration: none;\n}\n.ql-snow .ql-tooltip.ql-flip {\n  transform: translateY(-10px);\n}\n.ql-snow .ql-formats {\n  display: inline-block;\n  vertical-align: middle;\n}\n.ql-snow .ql-formats:after {\n  clear: both;\n  content: '';\n  display: table;\n}\n.ql-snow .ql-stroke {\n  fill: none;\n  stroke: #444;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 2;\n}\n.ql-snow .ql-stroke-miter {\n  fill: none;\n  stroke: #444;\n  stroke-miterlimit: 10;\n  stroke-width: 2;\n}\n.ql-snow .ql-fill,\n.ql-snow .ql-stroke.ql-fill {\n  fill: #444;\n}\n.ql-snow .ql-empty {\n  fill: none;\n}\n.ql-snow .ql-even {\n  fill-rule: evenodd;\n}\n.ql-snow .ql-thin,\n.ql-snow .ql-stroke.ql-thin {\n  stroke-width: 1;\n}\n.ql-snow .ql-transparent {\n  opacity: 0.4;\n}\n.ql-snow .ql-direction svg:last-child {\n  display: none;\n}\n.ql-snow .ql-direction.ql-active svg:last-child {\n  display: inline;\n}\n.ql-snow .ql-direction.ql-active svg:first-child {\n  display: none;\n}\n.ql-snow .ql-editor h1 {\n  font-size: 2em;\n}\n.ql-snow .ql-editor h2 {\n  font-size: 1.5em;\n}\n.ql-snow .ql-editor h3 {\n  font-size: 1.17em;\n}\n.ql-snow .ql-editor h4 {\n  font-size: 1em;\n}\n.ql-snow .ql-editor h5 {\n  font-size: 0.83em;\n}\n.ql-snow .ql-editor h6 {\n  font-size: 0.67em;\n}\n.ql-snow .ql-editor a {\n  text-decoration: underline;\n}\n.ql-snow .ql-editor blockquote {\n  border-left: 4px solid #ccc;\n  margin-bottom: 5px;\n  margin-top: 5px;\n  padding-left: 16px;\n}\n.ql-snow .ql-editor code,\n.ql-snow .ql-editor pre {\n  background-color: #f0f0f0;\n  border-radius: 3px;\n}\n.ql-snow .ql-editor pre {\n  white-space: pre-wrap;\n  margin-bottom: 5px;\n  margin-top: 5px;\n  padding: 5px 10px;\n}\n.ql-snow .ql-editor code {\n  font-size: 85%;\n  padding: 2px 4px;\n}\n.ql-snow .ql-editor pre.ql-syntax {\n  background-color: #23241f;\n  color: #f8f8f2;\n  overflow: visible;\n}\n.ql-snow .ql-editor img {\n  max-width: 100%;\n}\n.ql-snow .ql-picker {\n  color: #444;\n  display: inline-block;\n  float: left;\n  font-size: 14px;\n  font-weight: 500;\n  height: 24px;\n  position: relative;\n  vertical-align: middle;\n}\n.ql-snow .ql-picker-label {\n  cursor: pointer;\n  display: inline-block;\n  height: 100%;\n  padding-left: 8px;\n  padding-right: 2px;\n  position: relative;\n  width: 100%;\n}\n.ql-snow .ql-picker-label::before {\n  display: inline-block;\n  line-height: 22px;\n}\n.ql-snow .ql-picker-options {\n  background-color: #fff;\n  display: none;\n  min-width: 100%;\n  padding: 4px 8px;\n  position: absolute;\n  white-space: nowrap;\n}\n.ql-snow .ql-picker-options .ql-picker-item {\n  cursor: pointer;\n  display: block;\n  padding-bottom: 5px;\n  padding-top: 5px;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-label {\n  color: #ccc;\n  z-index: 2;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {\n  fill: #ccc;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {\n  stroke: #ccc;\n}\n.ql-snow .ql-picker.ql-expanded .ql-picker-options {\n  display: block;\n  margin-top: -1px;\n  top: 100%;\n  z-index: 1;\n}\n.ql-snow .ql-color-picker,\n.ql-snow .ql-icon-picker {\n  width: 28px;\n}\n.ql-snow .ql-color-picker .ql-picker-label,\n.ql-snow .ql-icon-picker .ql-picker-label {\n  padding: 2px 4px;\n}\n.ql-snow .ql-color-picker .ql-picker-label svg,\n.ql-snow .ql-icon-picker .ql-picker-label svg {\n  right: 4px;\n}\n.ql-snow .ql-icon-picker .ql-picker-options {\n  padding: 4px 0px;\n}\n.ql-snow .ql-icon-picker .ql-picker-item {\n  height: 24px;\n  width: 24px;\n  padding: 2px 4px;\n}\n.ql-snow .ql-color-picker .ql-picker-options {\n  padding: 3px 5px;\n  width: 152px;\n}\n.ql-snow .ql-color-picker .ql-picker-item {\n  border: 1px solid transparent;\n  float: left;\n  height: 16px;\n  margin: 2px;\n  padding: 0px;\n  width: 16px;\n}\n.ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {\n  position: absolute;\n  margin-top: -9px;\n  right: 0;\n  top: 50%;\n  width: 18px;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {\n  content: attr(data-label);\n}\n.ql-snow .ql-picker.ql-header {\n  width: 98px;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item::before {\n  content: 'Normal';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"1\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"1\"]::before {\n  content: 'Heading 1';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"2\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"2\"]::before {\n  content: 'Heading 2';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"3\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"3\"]::before {\n  content: 'Heading 3';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"4\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"4\"]::before {\n  content: 'Heading 4';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"5\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"5\"]::before {\n  content: 'Heading 5';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"6\"]::before,\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"6\"]::before {\n  content: 'Heading 6';\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"1\"]::before {\n  font-size: 2em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"2\"]::before {\n  font-size: 1.5em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"3\"]::before {\n  font-size: 1.17em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"4\"]::before {\n  font-size: 1em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"5\"]::before {\n  font-size: 0.83em;\n}\n.ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"6\"]::before {\n  font-size: 0.67em;\n}\n.ql-snow .ql-picker.ql-font {\n  width: 108px;\n}\n.ql-snow .ql-picker.ql-font .ql-picker-label::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item::before {\n  content: 'Sans Serif';\n}\n.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {\n  content: 'Serif';\n}\n.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {\n  content: 'Monospace';\n}\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {\n  font-family: Georgia, Times New Roman, serif;\n}\n.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {\n  font-family: Monaco, Courier New, monospace;\n}\n.ql-snow .ql-picker.ql-size {\n  width: 98px;\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item::before {\n  content: 'Normal';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {\n  content: 'Small';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {\n  content: 'Large';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {\n  content: 'Huge';\n}\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {\n  font-size: 10px;\n}\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {\n  font-size: 18px;\n}\n.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {\n  font-size: 32px;\n}\n.ql-snow .ql-color-picker.ql-background .ql-picker-item {\n  background-color: #fff;\n}\n.ql-snow .ql-color-picker.ql-color .ql-picker-item {\n  background-color: #000;\n}\n.ql-toolbar.ql-snow {\n  border: 1px solid #ccc;\n  box-sizing: border-box;\n  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\n  padding: 8px;\n}\n.ql-toolbar.ql-snow .ql-formats {\n  margin-right: 15px;\n}\n.ql-toolbar.ql-snow .ql-picker-label {\n  border: 1px solid transparent;\n}\n.ql-toolbar.ql-snow .ql-picker-options {\n  border: 1px solid transparent;\n  box-shadow: rgba(0,0,0,0.2) 0 2px 8px;\n}\n.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {\n  border-color: #ccc;\n}\n.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {\n  border-color: #ccc;\n}\n.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,\n.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {\n  border-color: #000;\n}\n.ql-toolbar.ql-snow + .ql-container.ql-snow {\n  border-top: 0px;\n}\n.ql-snow .ql-tooltip {\n  background-color: #fff;\n  border: 1px solid #ccc;\n  box-shadow: 0px 0px 5px #ddd;\n  color: #444;\n  padding: 5px 12px;\n  white-space: nowrap;\n}\n.ql-snow .ql-tooltip::before {\n  content: \"Visit URL:\";\n  line-height: 26px;\n  margin-right: 8px;\n}\n.ql-snow .ql-tooltip input[type=text] {\n  display: none;\n  border: 1px solid #ccc;\n  font-size: 13px;\n  height: 26px;\n  margin: 0px;\n  padding: 3px 5px;\n  width: 170px;\n}\n.ql-snow .ql-tooltip a.ql-preview {\n  display: inline-block;\n  max-width: 200px;\n  overflow-x: hidden;\n  text-overflow: ellipsis;\n  vertical-align: top;\n}\n.ql-snow .ql-tooltip a.ql-action::after {\n  border-right: 1px solid #ccc;\n  content: 'Edit';\n  margin-left: 16px;\n  padding-right: 8px;\n}\n.ql-snow .ql-tooltip a.ql-remove::before {\n  content: 'Remove';\n  margin-left: 8px;\n}\n.ql-snow .ql-tooltip a {\n  line-height: 26px;\n}\n.ql-snow .ql-tooltip.ql-editing a.ql-preview,\n.ql-snow .ql-tooltip.ql-editing a.ql-remove {\n  display: none;\n}\n.ql-snow .ql-tooltip.ql-editing input[type=text] {\n  display: inline-block;\n}\n.ql-snow .ql-tooltip.ql-editing a.ql-action::after {\n  border-right: 0px;\n  content: 'Save';\n  padding-right: 0px;\n}\n.ql-snow .ql-tooltip[data-mode=link]::before {\n  content: \"Enter link:\";\n}\n.ql-snow .ql-tooltip[data-mode=formula]::before {\n  content: \"Enter formula:\";\n}\n.ql-snow .ql-tooltip[data-mode=video]::before {\n  content: \"Enter video:\";\n}\n.ql-snow a {\n  color: #06c;\n}\n.ql-container.ql-snow {\n  border: 1px solid #ccc;\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL25vZGVfbW9kdWxlcy9xdWlsbC9kaXN0L3F1aWxsLnNub3cuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztFQUtFO0FBQ0Y7RUFDRSxzQkFBc0I7RUFDdEIseUNBQXlDO0VBQ3pDLGVBQWU7RUFDZixZQUFZO0VBQ1osV0FBVztFQUNYLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLGVBQWU7RUFDZixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixRQUFRO0FBQ1Y7QUFDQTtFQUNFLFNBQVM7RUFDVCxVQUFVO0FBQ1o7QUFDQTtFQUNFLHNCQUFzQjtFQUN0QixpQkFBaUI7RUFDakIsWUFBWTtFQUNaLGFBQWE7RUFDYixnQkFBZ0I7RUFDaEIsa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLHFCQUFxQjtFQUNyQixxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLFlBQVk7QUFDZDtBQUNBOzs7Ozs7Ozs7OztFQVdFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsNkVBQTZFO0FBQy9FO0FBQ0E7O0VBRUUsbUJBQW1CO0FBQ3JCO0FBQ0E7O0VBRUUscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxvQkFBb0I7QUFDdEI7QUFDQTs7RUFFRSxtQkFBbUI7QUFDckI7QUFDQTs7RUFFRSxXQUFXO0VBQ1gsZUFBZTtFQUNmLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLHFCQUFxQjtFQUNyQixtQkFBbUI7RUFDbkIsWUFBWTtBQUNkO0FBQ0E7RUFDRSxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLG9CQUFvQjtBQUN0QjtBQUNBOztFQUVFLG1CQUFtQjtBQUNyQjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBO0VBQ0UsNkVBQTZFO0VBQzdFLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0Usc0NBQXNDO0FBQ3hDO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0Usc0VBQXNFO0FBQ3hFO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UsK0RBQStEO0FBQ2pFO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHNDQUFzQztBQUN4QztBQUNBO0VBQ0Usd0RBQXdEO0FBQzFEO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UsaURBQWlEO0FBQ25EO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UsMENBQTBDO0FBQzVDO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHNDQUFzQztBQUN4QztBQUNBO0VBQ0UsbUNBQW1DO0FBQ3JDO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UsNEJBQTRCO0FBQzlCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLDBDQUEwQztBQUM1QztBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHNDQUFzQztBQUN4QztBQUNBO0VBQ0UsaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxtQkFBbUI7QUFDckI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLG9CQUFvQjtBQUN0QjtBQUNBO0VBQ0UsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxtQkFBbUI7QUFDckI7QUFDQTtFQUNFLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLG9CQUFvQjtBQUN0QjtBQUNBO0VBQ0UsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxtQkFBbUI7QUFDckI7QUFDQTtFQUNFLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0UsY0FBYztFQUNkLGVBQWU7QUFDakI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSxXQUFXO0FBQ2I7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLFdBQVc7QUFDYjtBQUNBO0VBQ0UsV0FBVztBQUNiO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxXQUFXO0FBQ2I7QUFDQTtFQUNFLFdBQVc7QUFDYjtBQUNBO0VBQ0UsNENBQTRDO0FBQzlDO0FBQ0E7RUFDRSwyQ0FBMkM7QUFDN0M7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGNBQWM7RUFDZCxtQkFBbUI7QUFDckI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLHNCQUFzQjtFQUN0QiwrQkFBK0I7RUFDL0Isa0JBQWtCO0VBQ2xCLFVBQVU7RUFDVixvQkFBb0I7RUFDcEIsa0JBQWtCO0VBQ2xCLFdBQVc7QUFDYjtBQUNBOztFQUVFLFdBQVc7RUFDWCxXQUFXO0VBQ1gsY0FBYztBQUNoQjtBQUNBOztFQUVFLGdCQUFnQjtFQUNoQixZQUFZO0VBQ1osZUFBZTtFQUNmLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsWUFBWTtFQUNaLGdCQUFnQjtFQUNoQixXQUFXO0FBQ2I7QUFDQTs7RUFFRSxXQUFXO0VBQ1gsWUFBWTtBQUNkO0FBQ0E7O0VBRUUsYUFBYTtBQUNmO0FBQ0E7O0VBRUUsYUFBYTtBQUNmO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0VBY0UsV0FBVztBQUNiO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0QkUsVUFBVTtBQUNaO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0QkUsWUFBWTtBQUNkO0FBQ0E7RUFDRTs7SUFFRSxXQUFXO0VBQ2I7RUFDQTs7OztJQUlFLFVBQVU7RUFDWjtFQUNBOzs7O0lBSUUsWUFBWTtFQUNkO0FBQ0Y7QUFDQTtFQUNFLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTs7RUFFRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQiwyQkFBMkI7QUFDN0I7QUFDQTtFQUNFLGVBQWU7RUFDZixxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UscUJBQXFCO0VBQ3JCLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0UsV0FBVztFQUNYLFdBQVc7RUFDWCxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxVQUFVO0VBQ1YsWUFBWTtFQUNaLHFCQUFxQjtFQUNyQixzQkFBc0I7RUFDdEIsZUFBZTtBQUNqQjtBQUNBO0VBQ0UsVUFBVTtFQUNWLFlBQVk7RUFDWixxQkFBcUI7RUFDckIsZUFBZTtBQUNqQjtBQUNBOztFQUVFLFVBQVU7QUFDWjtBQUNBO0VBQ0UsVUFBVTtBQUNaO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTs7RUFFRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxZQUFZO0FBQ2Q7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsZUFBZTtBQUNqQjtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBO0VBQ0UsaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLDBCQUEwQjtBQUM1QjtBQUNBO0VBQ0UsMkJBQTJCO0VBQzNCLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2Ysa0JBQWtCO0FBQ3BCO0FBQ0E7O0VBRUUseUJBQXlCO0VBQ3pCLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UscUJBQXFCO0VBQ3JCLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2YsaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIsY0FBYztFQUNkLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsZUFBZTtBQUNqQjtBQUNBO0VBQ0UsV0FBVztFQUNYLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0UsZUFBZTtFQUNmLHFCQUFxQjtFQUNyQixZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsV0FBVztBQUNiO0FBQ0E7RUFDRSxxQkFBcUI7RUFDckIsaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxzQkFBc0I7RUFDdEIsYUFBYTtFQUNiLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsa0JBQWtCO0VBQ2xCLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UsZUFBZTtFQUNmLGNBQWM7RUFDZCxtQkFBbUI7RUFDbkIsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxXQUFXO0VBQ1gsVUFBVTtBQUNaO0FBQ0E7RUFDRSxVQUFVO0FBQ1o7QUFDQTtFQUNFLFlBQVk7QUFDZDtBQUNBO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixTQUFTO0VBQ1QsVUFBVTtBQUNaO0FBQ0E7O0VBRUUsV0FBVztBQUNiO0FBQ0E7O0VBRUUsZ0JBQWdCO0FBQ2xCO0FBQ0E7O0VBRUUsVUFBVTtBQUNaO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLFlBQVk7RUFDWixXQUFXO0VBQ1gsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxnQkFBZ0I7RUFDaEIsWUFBWTtBQUNkO0FBQ0E7RUFDRSw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLFlBQVk7RUFDWixXQUFXO0VBQ1gsWUFBWTtFQUNaLFdBQVc7QUFDYjtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLGdCQUFnQjtFQUNoQixRQUFRO0VBQ1IsUUFBUTtFQUNSLFdBQVc7QUFDYjtBQUNBOzs7Ozs7RUFNRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLFdBQVc7QUFDYjtBQUNBOztFQUVFLGlCQUFpQjtBQUNuQjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBOztFQUVFLG9CQUFvQjtBQUN0QjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxZQUFZO0FBQ2Q7QUFDQTs7RUFFRSxxQkFBcUI7QUFDdkI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLDRDQUE0QztBQUM5QztBQUNBO0VBQ0UsMkNBQTJDO0FBQzdDO0FBQ0E7RUFDRSxXQUFXO0FBQ2I7QUFDQTs7RUFFRSxpQkFBaUI7QUFDbkI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxzQkFBc0I7QUFDeEI7QUFDQTtFQUNFLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0Usc0JBQXNCO0VBQ3RCLHNCQUFzQjtFQUN0QiwrREFBK0Q7RUFDL0QsWUFBWTtBQUNkO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLDZCQUE2QjtBQUMvQjtBQUNBO0VBQ0UsNkJBQTZCO0VBQzdCLHFDQUFxQztBQUN2QztBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTs7RUFFRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7QUFDakI7QUFDQTtFQUNFLHNCQUFzQjtFQUN0QixzQkFBc0I7RUFDdEIsNEJBQTRCO0VBQzVCLFdBQVc7RUFDWCxpQkFBaUI7RUFDakIsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxxQkFBcUI7RUFDckIsaUJBQWlCO0VBQ2pCLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixlQUFlO0VBQ2YsWUFBWTtFQUNaLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsWUFBWTtBQUNkO0FBQ0E7RUFDRSxxQkFBcUI7RUFDckIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtFQUNsQix1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSw0QkFBNEI7RUFDNUIsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGlCQUFpQjtFQUNqQixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBOztFQUVFLGFBQWE7QUFDZjtBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSxpQkFBaUI7RUFDakIsZUFBZTtFQUNmLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHVCQUF1QjtBQUN6QjtBQUNBO0VBQ0UsV0FBVztBQUNiO0FBQ0E7RUFDRSxzQkFBc0I7QUFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIFF1aWxsIEVkaXRvciB2MS4zLjdcbiAqIGh0dHBzOi8vcXVpbGxqcy5jb20vXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEphc29uIENoZW5cbiAqIENvcHlyaWdodCAoYykgMjAxMywgc2FsZXNmb3JjZS5jb21cbiAqL1xuLnFsLWNvbnRhaW5lciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDEzcHg7XG4gIGhlaWdodDogMTAwJTtcbiAgbWFyZ2luOiAwcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5xbC1jb250YWluZXIucWwtZGlzYWJsZWQgLnFsLXRvb2x0aXAge1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG59XG4ucWwtY29udGFpbmVyLnFsLWRpc2FibGVkIC5xbC1lZGl0b3IgdWxbZGF0YS1jaGVja2VkXSA+IGxpOjpiZWZvcmUge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5xbC1jbGlwYm9hcmQge1xuICBsZWZ0OiAtMTAwMDAwcHg7XG4gIGhlaWdodDogMXB4O1xuICBvdmVyZmxvdy15OiBoaWRkZW47XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG59XG4ucWwtY2xpcGJvYXJkIHAge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG4ucWwtZWRpdG9yIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgbGluZS1oZWlnaHQ6IDEuNDI7XG4gIGhlaWdodDogMTAwJTtcbiAgb3V0bGluZTogbm9uZTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgcGFkZGluZzogMTJweCAxNXB4O1xuICB0YWItc2l6ZTogNDtcbiAgLW1vei10YWItc2l6ZTogNDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG59XG4ucWwtZWRpdG9yID4gKiB7XG4gIGN1cnNvcjogdGV4dDtcbn1cbi5xbC1lZGl0b3IgcCxcbi5xbC1lZGl0b3Igb2wsXG4ucWwtZWRpdG9yIHVsLFxuLnFsLWVkaXRvciBwcmUsXG4ucWwtZWRpdG9yIGJsb2NrcXVvdGUsXG4ucWwtZWRpdG9yIGgxLFxuLnFsLWVkaXRvciBoMixcbi5xbC1lZGl0b3IgaDMsXG4ucWwtZWRpdG9yIGg0LFxuLnFsLWVkaXRvciBoNSxcbi5xbC1lZGl0b3IgaDYge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGNvdW50ZXItcmVzZXQ6IGxpc3QtMSBsaXN0LTIgbGlzdC0zIGxpc3QtNCBsaXN0LTUgbGlzdC02IGxpc3QtNyBsaXN0LTggbGlzdC05O1xufVxuLnFsLWVkaXRvciBvbCxcbi5xbC1lZGl0b3IgdWwge1xuICBwYWRkaW5nLWxlZnQ6IDEuNWVtO1xufVxuLnFsLWVkaXRvciBvbCA+IGxpLFxuLnFsLWVkaXRvciB1bCA+IGxpIHtcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xufVxuLnFsLWVkaXRvciB1bCA+IGxpOjpiZWZvcmUge1xuICBjb250ZW50OiAnXFwyMDIyJztcbn1cbi5xbC1lZGl0b3IgdWxbZGF0YS1jaGVja2VkPXRydWVdLFxuLnFsLWVkaXRvciB1bFtkYXRhLWNoZWNrZWQ9ZmFsc2VdIHtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4ucWwtZWRpdG9yIHVsW2RhdGEtY2hlY2tlZD10cnVlXSA+IGxpICosXG4ucWwtZWRpdG9yIHVsW2RhdGEtY2hlY2tlZD1mYWxzZV0gPiBsaSAqIHtcbiAgcG9pbnRlci1ldmVudHM6IGFsbDtcbn1cbi5xbC1lZGl0b3IgdWxbZGF0YS1jaGVja2VkPXRydWVdID4gbGk6OmJlZm9yZSxcbi5xbC1lZGl0b3IgdWxbZGF0YS1jaGVja2VkPWZhbHNlXSA+IGxpOjpiZWZvcmUge1xuICBjb2xvcjogIzc3NztcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwb2ludGVyLWV2ZW50czogYWxsO1xufVxuLnFsLWVkaXRvciB1bFtkYXRhLWNoZWNrZWQ9dHJ1ZV0gPiBsaTo6YmVmb3JlIHtcbiAgY29udGVudDogJ1xcMjYxMSc7XG59XG4ucWwtZWRpdG9yIHVsW2RhdGEtY2hlY2tlZD1mYWxzZV0gPiBsaTo6YmVmb3JlIHtcbiAgY29udGVudDogJ1xcMjYxMCc7XG59XG4ucWwtZWRpdG9yIGxpOjpiZWZvcmUge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHdpZHRoOiAxLjJlbTtcbn1cbi5xbC1lZGl0b3IgbGk6bm90KC5xbC1kaXJlY3Rpb24tcnRsKTo6YmVmb3JlIHtcbiAgbWFyZ2luLWxlZnQ6IC0xLjVlbTtcbiAgbWFyZ2luLXJpZ2h0OiAwLjNlbTtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4ucWwtZWRpdG9yIGxpLnFsLWRpcmVjdGlvbi1ydGw6OmJlZm9yZSB7XG4gIG1hcmdpbi1sZWZ0OiAwLjNlbTtcbiAgbWFyZ2luLXJpZ2h0OiAtMS41ZW07XG59XG4ucWwtZWRpdG9yIG9sIGxpOm5vdCgucWwtZGlyZWN0aW9uLXJ0bCksXG4ucWwtZWRpdG9yIHVsIGxpOm5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDEuNWVtO1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1kaXJlY3Rpb24tcnRsLFxuLnFsLWVkaXRvciB1bCBsaS5xbC1kaXJlY3Rpb24tcnRsIHtcbiAgcGFkZGluZy1yaWdodDogMS41ZW07XG59XG4ucWwtZWRpdG9yIG9sIGxpIHtcbiAgY291bnRlci1yZXNldDogbGlzdC0xIGxpc3QtMiBsaXN0LTMgbGlzdC00IGxpc3QtNSBsaXN0LTYgbGlzdC03IGxpc3QtOCBsaXN0LTk7XG4gIGNvdW50ZXItaW5jcmVtZW50OiBsaXN0LTA7XG59XG4ucWwtZWRpdG9yIG9sIGxpOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IGNvdW50ZXIobGlzdC0wLCBkZWNpbWFsKSAnLiAnO1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtMSB7XG4gIGNvdW50ZXItaW5jcmVtZW50OiBsaXN0LTE7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC0xOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IGNvdW50ZXIobGlzdC0xLCBsb3dlci1hbHBoYSkgJy4gJztcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTEge1xuICBjb3VudGVyLXJlc2V0OiBsaXN0LTIgbGlzdC0zIGxpc3QtNCBsaXN0LTUgbGlzdC02IGxpc3QtNyBsaXN0LTggbGlzdC05O1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtMiB7XG4gIGNvdW50ZXItaW5jcmVtZW50OiBsaXN0LTI7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC0yOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IGNvdW50ZXIobGlzdC0yLCBsb3dlci1yb21hbikgJy4gJztcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTIge1xuICBjb3VudGVyLXJlc2V0OiBsaXN0LTMgbGlzdC00IGxpc3QtNSBsaXN0LTYgbGlzdC03IGxpc3QtOCBsaXN0LTk7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC0zIHtcbiAgY291bnRlci1pbmNyZW1lbnQ6IGxpc3QtMztcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTM6YmVmb3JlIHtcbiAgY29udGVudDogY291bnRlcihsaXN0LTMsIGRlY2ltYWwpICcuICc7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC0zIHtcbiAgY291bnRlci1yZXNldDogbGlzdC00IGxpc3QtNSBsaXN0LTYgbGlzdC03IGxpc3QtOCBsaXN0LTk7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC00IHtcbiAgY291bnRlci1pbmNyZW1lbnQ6IGxpc3QtNDtcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTQ6YmVmb3JlIHtcbiAgY29udGVudDogY291bnRlcihsaXN0LTQsIGxvd2VyLWFscGhhKSAnLiAnO1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtNCB7XG4gIGNvdW50ZXItcmVzZXQ6IGxpc3QtNSBsaXN0LTYgbGlzdC03IGxpc3QtOCBsaXN0LTk7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC01IHtcbiAgY291bnRlci1pbmNyZW1lbnQ6IGxpc3QtNTtcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTU6YmVmb3JlIHtcbiAgY29udGVudDogY291bnRlcihsaXN0LTUsIGxvd2VyLXJvbWFuKSAnLiAnO1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtNSB7XG4gIGNvdW50ZXItcmVzZXQ6IGxpc3QtNiBsaXN0LTcgbGlzdC04IGxpc3QtOTtcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTYge1xuICBjb3VudGVyLWluY3JlbWVudDogbGlzdC02O1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtNjpiZWZvcmUge1xuICBjb250ZW50OiBjb3VudGVyKGxpc3QtNiwgZGVjaW1hbCkgJy4gJztcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTYge1xuICBjb3VudGVyLXJlc2V0OiBsaXN0LTcgbGlzdC04IGxpc3QtOTtcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTcge1xuICBjb3VudGVyLWluY3JlbWVudDogbGlzdC03O1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtNzpiZWZvcmUge1xuICBjb250ZW50OiBjb3VudGVyKGxpc3QtNywgbG93ZXItYWxwaGEpICcuICc7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC03IHtcbiAgY291bnRlci1yZXNldDogbGlzdC04IGxpc3QtOTtcbn1cbi5xbC1lZGl0b3Igb2wgbGkucWwtaW5kZW50LTgge1xuICBjb3VudGVyLWluY3JlbWVudDogbGlzdC04O1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtODpiZWZvcmUge1xuICBjb250ZW50OiBjb3VudGVyKGxpc3QtOCwgbG93ZXItcm9tYW4pICcuICc7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC04IHtcbiAgY291bnRlci1yZXNldDogbGlzdC05O1xufVxuLnFsLWVkaXRvciBvbCBsaS5xbC1pbmRlbnQtOSB7XG4gIGNvdW50ZXItaW5jcmVtZW50OiBsaXN0LTk7XG59XG4ucWwtZWRpdG9yIG9sIGxpLnFsLWluZGVudC05OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IGNvdW50ZXIobGlzdC05LCBkZWNpbWFsKSAnLiAnO1xufVxuLnFsLWVkaXRvciAucWwtaW5kZW50LTE6bm90KC5xbC1kaXJlY3Rpb24tcnRsKSB7XG4gIHBhZGRpbmctbGVmdDogM2VtO1xufVxuLnFsLWVkaXRvciBsaS5xbC1pbmRlbnQtMTpub3QoLnFsLWRpcmVjdGlvbi1ydGwpIHtcbiAgcGFkZGluZy1sZWZ0OiA0LjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC0xLnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiAzZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC0xLnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiA0LjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC0yOm5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDZlbTtcbn1cbi5xbC1lZGl0b3IgbGkucWwtaW5kZW50LTI6bm90KC5xbC1kaXJlY3Rpb24tcnRsKSB7XG4gIHBhZGRpbmctbGVmdDogNy41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC1pbmRlbnQtMi5xbC1kaXJlY3Rpb24tcnRsLnFsLWFsaWduLXJpZ2h0IHtcbiAgcGFkZGluZy1yaWdodDogNmVtO1xufVxuLnFsLWVkaXRvciBsaS5xbC1pbmRlbnQtMi5xbC1kaXJlY3Rpb24tcnRsLnFsLWFsaWduLXJpZ2h0IHtcbiAgcGFkZGluZy1yaWdodDogNy41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC1pbmRlbnQtMzpub3QoLnFsLWRpcmVjdGlvbi1ydGwpIHtcbiAgcGFkZGluZy1sZWZ0OiA5ZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC0zOm5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDEwLjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC0zLnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiA5ZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC0zLnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiAxMC41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC1pbmRlbnQtNDpub3QoLnFsLWRpcmVjdGlvbi1ydGwpIHtcbiAgcGFkZGluZy1sZWZ0OiAxMmVtO1xufVxuLnFsLWVkaXRvciBsaS5xbC1pbmRlbnQtNDpub3QoLnFsLWRpcmVjdGlvbi1ydGwpIHtcbiAgcGFkZGluZy1sZWZ0OiAxMy41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC1pbmRlbnQtNC5xbC1kaXJlY3Rpb24tcnRsLnFsLWFsaWduLXJpZ2h0IHtcbiAgcGFkZGluZy1yaWdodDogMTJlbTtcbn1cbi5xbC1lZGl0b3IgbGkucWwtaW5kZW50LTQucWwtZGlyZWN0aW9uLXJ0bC5xbC1hbGlnbi1yaWdodCB7XG4gIHBhZGRpbmctcmlnaHQ6IDEzLjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC01Om5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDE1ZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC01Om5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDE2LjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC01LnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiAxNWVtO1xufVxuLnFsLWVkaXRvciBsaS5xbC1pbmRlbnQtNS5xbC1kaXJlY3Rpb24tcnRsLnFsLWFsaWduLXJpZ2h0IHtcbiAgcGFkZGluZy1yaWdodDogMTYuNWVtO1xufVxuLnFsLWVkaXRvciAucWwtaW5kZW50LTY6bm90KC5xbC1kaXJlY3Rpb24tcnRsKSB7XG4gIHBhZGRpbmctbGVmdDogMThlbTtcbn1cbi5xbC1lZGl0b3IgbGkucWwtaW5kZW50LTY6bm90KC5xbC1kaXJlY3Rpb24tcnRsKSB7XG4gIHBhZGRpbmctbGVmdDogMTkuNWVtO1xufVxuLnFsLWVkaXRvciAucWwtaW5kZW50LTYucWwtZGlyZWN0aW9uLXJ0bC5xbC1hbGlnbi1yaWdodCB7XG4gIHBhZGRpbmctcmlnaHQ6IDE4ZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC02LnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiAxOS41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC1pbmRlbnQtNzpub3QoLnFsLWRpcmVjdGlvbi1ydGwpIHtcbiAgcGFkZGluZy1sZWZ0OiAyMWVtO1xufVxuLnFsLWVkaXRvciBsaS5xbC1pbmRlbnQtNzpub3QoLnFsLWRpcmVjdGlvbi1ydGwpIHtcbiAgcGFkZGluZy1sZWZ0OiAyMi41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC1pbmRlbnQtNy5xbC1kaXJlY3Rpb24tcnRsLnFsLWFsaWduLXJpZ2h0IHtcbiAgcGFkZGluZy1yaWdodDogMjFlbTtcbn1cbi5xbC1lZGl0b3IgbGkucWwtaW5kZW50LTcucWwtZGlyZWN0aW9uLXJ0bC5xbC1hbGlnbi1yaWdodCB7XG4gIHBhZGRpbmctcmlnaHQ6IDIyLjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC04Om5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDI0ZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC04Om5vdCgucWwtZGlyZWN0aW9uLXJ0bCkge1xuICBwYWRkaW5nLWxlZnQ6IDI1LjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWluZGVudC04LnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiAyNGVtO1xufVxuLnFsLWVkaXRvciBsaS5xbC1pbmRlbnQtOC5xbC1kaXJlY3Rpb24tcnRsLnFsLWFsaWduLXJpZ2h0IHtcbiAgcGFkZGluZy1yaWdodDogMjUuNWVtO1xufVxuLnFsLWVkaXRvciAucWwtaW5kZW50LTk6bm90KC5xbC1kaXJlY3Rpb24tcnRsKSB7XG4gIHBhZGRpbmctbGVmdDogMjdlbTtcbn1cbi5xbC1lZGl0b3IgbGkucWwtaW5kZW50LTk6bm90KC5xbC1kaXJlY3Rpb24tcnRsKSB7XG4gIHBhZGRpbmctbGVmdDogMjguNWVtO1xufVxuLnFsLWVkaXRvciAucWwtaW5kZW50LTkucWwtZGlyZWN0aW9uLXJ0bC5xbC1hbGlnbi1yaWdodCB7XG4gIHBhZGRpbmctcmlnaHQ6IDI3ZW07XG59XG4ucWwtZWRpdG9yIGxpLnFsLWluZGVudC05LnFsLWRpcmVjdGlvbi1ydGwucWwtYWxpZ24tcmlnaHQge1xuICBwYWRkaW5nLXJpZ2h0OiAyOC41ZW07XG59XG4ucWwtZWRpdG9yIC5xbC12aWRlbyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXgtd2lkdGg6IDEwMCU7XG59XG4ucWwtZWRpdG9yIC5xbC12aWRlby5xbC1hbGlnbi1jZW50ZXIge1xuICBtYXJnaW46IDAgYXV0bztcbn1cbi5xbC1lZGl0b3IgLnFsLXZpZGVvLnFsLWFsaWduLXJpZ2h0IHtcbiAgbWFyZ2luOiAwIDAgMCBhdXRvO1xufVxuLnFsLWVkaXRvciAucWwtYmctYmxhY2sge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xufVxuLnFsLWVkaXRvciAucWwtYmctcmVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U2MDAwMDtcbn1cbi5xbC1lZGl0b3IgLnFsLWJnLW9yYW5nZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOTA7XG59XG4ucWwtZWRpdG9yIC5xbC1iZy15ZWxsb3cge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwO1xufVxuLnFsLWVkaXRvciAucWwtYmctZ3JlZW4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA4YTAwO1xufVxuLnFsLWVkaXRvciAucWwtYmctYmx1ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwNmM7XG59XG4ucWwtZWRpdG9yIC5xbC1iZy1wdXJwbGUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOTNmO1xufVxuLnFsLWVkaXRvciAucWwtY29sb3Itd2hpdGUge1xuICBjb2xvcjogI2ZmZjtcbn1cbi5xbC1lZGl0b3IgLnFsLWNvbG9yLXJlZCB7XG4gIGNvbG9yOiAjZTYwMDAwO1xufVxuLnFsLWVkaXRvciAucWwtY29sb3Itb3JhbmdlIHtcbiAgY29sb3I6ICNmOTA7XG59XG4ucWwtZWRpdG9yIC5xbC1jb2xvci15ZWxsb3cge1xuICBjb2xvcjogI2ZmMDtcbn1cbi5xbC1lZGl0b3IgLnFsLWNvbG9yLWdyZWVuIHtcbiAgY29sb3I6ICMwMDhhMDA7XG59XG4ucWwtZWRpdG9yIC5xbC1jb2xvci1ibHVlIHtcbiAgY29sb3I6ICMwNmM7XG59XG4ucWwtZWRpdG9yIC5xbC1jb2xvci1wdXJwbGUge1xuICBjb2xvcjogIzkzZjtcbn1cbi5xbC1lZGl0b3IgLnFsLWZvbnQtc2VyaWYge1xuICBmb250LWZhbWlseTogR2VvcmdpYSwgVGltZXMgTmV3IFJvbWFuLCBzZXJpZjtcbn1cbi5xbC1lZGl0b3IgLnFsLWZvbnQtbW9ub3NwYWNlIHtcbiAgZm9udC1mYW1pbHk6IE1vbmFjbywgQ291cmllciBOZXcsIG1vbm9zcGFjZTtcbn1cbi5xbC1lZGl0b3IgLnFsLXNpemUtc21hbGwge1xuICBmb250LXNpemU6IDAuNzVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLXNpemUtbGFyZ2Uge1xuICBmb250LXNpemU6IDEuNWVtO1xufVxuLnFsLWVkaXRvciAucWwtc2l6ZS1odWdlIHtcbiAgZm9udC1zaXplOiAyLjVlbTtcbn1cbi5xbC1lZGl0b3IgLnFsLWRpcmVjdGlvbi1ydGwge1xuICBkaXJlY3Rpb246IHJ0bDtcbiAgdGV4dC1hbGlnbjogaW5oZXJpdDtcbn1cbi5xbC1lZGl0b3IgLnFsLWFsaWduLWNlbnRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbi5xbC1lZGl0b3IgLnFsLWFsaWduLWp1c3RpZnkge1xuICB0ZXh0LWFsaWduOiBqdXN0aWZ5O1xufVxuLnFsLWVkaXRvciAucWwtYWxpZ24tcmlnaHQge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cbi5xbC1lZGl0b3IucWwtYmxhbms6OmJlZm9yZSB7XG4gIGNvbG9yOiByZ2JhKDAsMCwwLDAuNik7XG4gIGNvbnRlbnQ6IGF0dHIoZGF0YS1wbGFjZWhvbGRlcik7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgbGVmdDogMTVweDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDE1cHg7XG59XG4ucWwtc25vdy5xbC10b29sYmFyOmFmdGVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXI6YWZ0ZXIge1xuICBjbGVhcjogYm90aDtcbiAgY29udGVudDogJyc7XG4gIGRpc3BsYXk6IHRhYmxlO1xufVxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b24sXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b24ge1xuICBiYWNrZ3JvdW5kOiBub25lO1xuICBib3JkZXI6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmbG9hdDogbGVmdDtcbiAgaGVpZ2h0OiAyNHB4O1xuICBwYWRkaW5nOiAzcHggNXB4O1xuICB3aWR0aDogMjhweDtcbn1cbi5xbC1zbm93LnFsLXRvb2xiYXIgYnV0dG9uIHN2Zyxcbi5xbC1zbm93IC5xbC10b29sYmFyIGJ1dHRvbiBzdmcge1xuICBmbG9hdDogbGVmdDtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246YWN0aXZlOmhvdmVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmFjdGl2ZTpob3ZlciB7XG4gIG91dGxpbmU6IG5vbmU7XG59XG4ucWwtc25vdy5xbC10b29sYmFyIGlucHV0LnFsLWltYWdlW3R5cGU9ZmlsZV0sXG4ucWwtc25vdyAucWwtdG9vbGJhciBpbnB1dC5xbC1pbWFnZVt0eXBlPWZpbGVdIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5xbC1zbm93LnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyLFxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246Zm9jdXMsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b246Zm9jdXMsXG4ucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbi5xbC1hY3RpdmUsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b24ucWwtYWN0aXZlLFxuLnFsLXNub3cucWwtdG9vbGJhciAucWwtcGlja2VyLWxhYmVsOmhvdmVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbDpob3Zlcixcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbC5xbC1hY3RpdmUsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWxhYmVsLnFsLWFjdGl2ZSxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyLFxuLnFsLXNub3cucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW0ucWwtc2VsZWN0ZWQsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW0ucWwtc2VsZWN0ZWQge1xuICBjb2xvcjogIzA2Yztcbn1cbi5xbC1zbm93LnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyIC5xbC1maWxsLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyIC5xbC1maWxsLFxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246Zm9jdXMgLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b246Zm9jdXMgLnFsLWZpbGwsXG4ucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbi5xbC1hY3RpdmUgLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b24ucWwtYWN0aXZlIC5xbC1maWxsLFxuLnFsLXNub3cucWwtdG9vbGJhciAucWwtcGlja2VyLWxhYmVsOmhvdmVyIC5xbC1maWxsLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbDpob3ZlciAucWwtZmlsbCxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbC5xbC1hY3RpdmUgLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWxhYmVsLnFsLWFjdGl2ZSAucWwtZmlsbCxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyIC5xbC1maWxsLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyIC5xbC1maWxsLFxuLnFsLXNub3cucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW0ucWwtc2VsZWN0ZWQgLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW0ucWwtc2VsZWN0ZWQgLnFsLWZpbGwsXG4ucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbjpob3ZlciAucWwtc3Ryb2tlLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b246aG92ZXIgLnFsLXN0cm9rZS5xbC1maWxsLFxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246Zm9jdXMgLnFsLXN0cm9rZS5xbC1maWxsLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmZvY3VzIC5xbC1zdHJva2UucWwtZmlsbCxcbi5xbC1zbm93LnFsLXRvb2xiYXIgYnV0dG9uLnFsLWFjdGl2ZSAucWwtc3Ryb2tlLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b24ucWwtYWN0aXZlIC5xbC1zdHJva2UucWwtZmlsbCxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbDpob3ZlciAucWwtc3Ryb2tlLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWxhYmVsOmhvdmVyIC5xbC1zdHJva2UucWwtZmlsbCxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbC5xbC1hY3RpdmUgLnFsLXN0cm9rZS5xbC1maWxsLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbC5xbC1hY3RpdmUgLnFsLXN0cm9rZS5xbC1maWxsLFxuLnFsLXNub3cucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW06aG92ZXIgLnFsLXN0cm9rZS5xbC1maWxsLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyIC5xbC1zdHJva2UucWwtZmlsbCxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtLnFsLXNlbGVjdGVkIC5xbC1zdHJva2UucWwtZmlsbCxcbi5xbC1zbm93IC5xbC10b29sYmFyIC5xbC1waWNrZXItaXRlbS5xbC1zZWxlY3RlZCAucWwtc3Ryb2tlLnFsLWZpbGwge1xuICBmaWxsOiAjMDZjO1xufVxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246aG92ZXIgLnFsLXN0cm9rZSxcbi5xbC1zbm93IC5xbC10b29sYmFyIGJ1dHRvbjpob3ZlciAucWwtc3Ryb2tlLFxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246Zm9jdXMgLnFsLXN0cm9rZSxcbi5xbC1zbm93IC5xbC10b29sYmFyIGJ1dHRvbjpmb2N1cyAucWwtc3Ryb2tlLFxuLnFsLXNub3cucWwtdG9vbGJhciBidXR0b24ucWwtYWN0aXZlIC5xbC1zdHJva2UsXG4ucWwtc25vdyAucWwtdG9vbGJhciBidXR0b24ucWwtYWN0aXZlIC5xbC1zdHJva2UsXG4ucWwtc25vdy5xbC10b29sYmFyIC5xbC1waWNrZXItbGFiZWw6aG92ZXIgLnFsLXN0cm9rZSxcbi5xbC1zbm93IC5xbC10b29sYmFyIC5xbC1waWNrZXItbGFiZWw6aG92ZXIgLnFsLXN0cm9rZSxcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbC5xbC1hY3RpdmUgLnFsLXN0cm9rZSxcbi5xbC1zbm93IC5xbC10b29sYmFyIC5xbC1waWNrZXItbGFiZWwucWwtYWN0aXZlIC5xbC1zdHJva2UsXG4ucWwtc25vdy5xbC10b29sYmFyIC5xbC1waWNrZXItaXRlbTpob3ZlciAucWwtc3Ryb2tlLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyIC5xbC1zdHJva2UsXG4ucWwtc25vdy5xbC10b29sYmFyIC5xbC1waWNrZXItaXRlbS5xbC1zZWxlY3RlZCAucWwtc3Ryb2tlLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtLnFsLXNlbGVjdGVkIC5xbC1zdHJva2UsXG4ucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbjpob3ZlciAucWwtc3Ryb2tlLW1pdGVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyIC5xbC1zdHJva2UtbWl0ZXIsXG4ucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbjpmb2N1cyAucWwtc3Ryb2tlLW1pdGVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmZvY3VzIC5xbC1zdHJva2UtbWl0ZXIsXG4ucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbi5xbC1hY3RpdmUgLnFsLXN0cm9rZS1taXRlcixcbi5xbC1zbm93IC5xbC10b29sYmFyIGJ1dHRvbi5xbC1hY3RpdmUgLnFsLXN0cm9rZS1taXRlcixcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbDpob3ZlciAucWwtc3Ryb2tlLW1pdGVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbDpob3ZlciAucWwtc3Ryb2tlLW1pdGVyLFxuLnFsLXNub3cucWwtdG9vbGJhciAucWwtcGlja2VyLWxhYmVsLnFsLWFjdGl2ZSAucWwtc3Ryb2tlLW1pdGVyLFxuLnFsLXNub3cgLnFsLXRvb2xiYXIgLnFsLXBpY2tlci1sYWJlbC5xbC1hY3RpdmUgLnFsLXN0cm9rZS1taXRlcixcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtOmhvdmVyIC5xbC1zdHJva2UtbWl0ZXIsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW06aG92ZXIgLnFsLXN0cm9rZS1taXRlcixcbi5xbC1zbm93LnFsLXRvb2xiYXIgLnFsLXBpY2tlci1pdGVtLnFsLXNlbGVjdGVkIC5xbC1zdHJva2UtbWl0ZXIsXG4ucWwtc25vdyAucWwtdG9vbGJhciAucWwtcGlja2VyLWl0ZW0ucWwtc2VsZWN0ZWQgLnFsLXN0cm9rZS1taXRlciB7XG4gIHN0cm9rZTogIzA2Yztcbn1cbkBtZWRpYSAocG9pbnRlcjogY29hcnNlKSB7XG4gIC5xbC1zbm93LnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyOm5vdCgucWwtYWN0aXZlKSxcbiAgLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyOm5vdCgucWwtYWN0aXZlKSB7XG4gICAgY29sb3I6ICM0NDQ7XG4gIH1cbiAgLnFsLXNub3cucWwtdG9vbGJhciBidXR0b246aG92ZXI6bm90KC5xbC1hY3RpdmUpIC5xbC1maWxsLFxuICAucWwtc25vdyAucWwtdG9vbGJhciBidXR0b246aG92ZXI6bm90KC5xbC1hY3RpdmUpIC5xbC1maWxsLFxuICAucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbjpob3Zlcjpub3QoLnFsLWFjdGl2ZSkgLnFsLXN0cm9rZS5xbC1maWxsLFxuICAucWwtc25vdyAucWwtdG9vbGJhciBidXR0b246aG92ZXI6bm90KC5xbC1hY3RpdmUpIC5xbC1zdHJva2UucWwtZmlsbCB7XG4gICAgZmlsbDogIzQ0NDtcbiAgfVxuICAucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbjpob3Zlcjpub3QoLnFsLWFjdGl2ZSkgLnFsLXN0cm9rZSxcbiAgLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyOm5vdCgucWwtYWN0aXZlKSAucWwtc3Ryb2tlLFxuICAucWwtc25vdy5xbC10b29sYmFyIGJ1dHRvbjpob3Zlcjpub3QoLnFsLWFjdGl2ZSkgLnFsLXN0cm9rZS1taXRlcixcbiAgLnFsLXNub3cgLnFsLXRvb2xiYXIgYnV0dG9uOmhvdmVyOm5vdCgucWwtYWN0aXZlKSAucWwtc3Ryb2tlLW1pdGVyIHtcbiAgICBzdHJva2U6ICM0NDQ7XG4gIH1cbn1cbi5xbC1zbm93IHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbi5xbC1zbm93ICoge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuLnFsLXNub3cgLnFsLWhpZGRlbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4ucWwtc25vdyAucWwtb3V0LWJvdHRvbSxcbi5xbC1zbm93IC5xbC1vdXQtdG9wIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMHB4KTtcbn1cbi5xbC1zbm93IC5xbC10b29sdGlwIGEge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbi5xbC1zbm93IC5xbC10b29sdGlwLnFsLWZsaXAge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTEwcHgpO1xufVxuLnFsLXNub3cgLnFsLWZvcm1hdHMge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG4ucWwtc25vdyAucWwtZm9ybWF0czphZnRlciB7XG4gIGNsZWFyOiBib3RoO1xuICBjb250ZW50OiAnJztcbiAgZGlzcGxheTogdGFibGU7XG59XG4ucWwtc25vdyAucWwtc3Ryb2tlIHtcbiAgZmlsbDogbm9uZTtcbiAgc3Ryb2tlOiAjNDQ0O1xuICBzdHJva2UtbGluZWNhcDogcm91bmQ7XG4gIHN0cm9rZS1saW5lam9pbjogcm91bmQ7XG4gIHN0cm9rZS13aWR0aDogMjtcbn1cbi5xbC1zbm93IC5xbC1zdHJva2UtbWl0ZXIge1xuICBmaWxsOiBub25lO1xuICBzdHJva2U6ICM0NDQ7XG4gIHN0cm9rZS1taXRlcmxpbWl0OiAxMDtcbiAgc3Ryb2tlLXdpZHRoOiAyO1xufVxuLnFsLXNub3cgLnFsLWZpbGwsXG4ucWwtc25vdyAucWwtc3Ryb2tlLnFsLWZpbGwge1xuICBmaWxsOiAjNDQ0O1xufVxuLnFsLXNub3cgLnFsLWVtcHR5IHtcbiAgZmlsbDogbm9uZTtcbn1cbi5xbC1zbm93IC5xbC1ldmVuIHtcbiAgZmlsbC1ydWxlOiBldmVub2RkO1xufVxuLnFsLXNub3cgLnFsLXRoaW4sXG4ucWwtc25vdyAucWwtc3Ryb2tlLnFsLXRoaW4ge1xuICBzdHJva2Utd2lkdGg6IDE7XG59XG4ucWwtc25vdyAucWwtdHJhbnNwYXJlbnQge1xuICBvcGFjaXR5OiAwLjQ7XG59XG4ucWwtc25vdyAucWwtZGlyZWN0aW9uIHN2ZzpsYXN0LWNoaWxkIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5xbC1zbm93IC5xbC1kaXJlY3Rpb24ucWwtYWN0aXZlIHN2ZzpsYXN0LWNoaWxkIHtcbiAgZGlzcGxheTogaW5saW5lO1xufVxuLnFsLXNub3cgLnFsLWRpcmVjdGlvbi5xbC1hY3RpdmUgc3ZnOmZpcnN0LWNoaWxkIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5xbC1zbm93IC5xbC1lZGl0b3IgaDEge1xuICBmb250LXNpemU6IDJlbTtcbn1cbi5xbC1zbm93IC5xbC1lZGl0b3IgaDIge1xuICBmb250LXNpemU6IDEuNWVtO1xufVxuLnFsLXNub3cgLnFsLWVkaXRvciBoMyB7XG4gIGZvbnQtc2l6ZTogMS4xN2VtO1xufVxuLnFsLXNub3cgLnFsLWVkaXRvciBoNCB7XG4gIGZvbnQtc2l6ZTogMWVtO1xufVxuLnFsLXNub3cgLnFsLWVkaXRvciBoNSB7XG4gIGZvbnQtc2l6ZTogMC44M2VtO1xufVxuLnFsLXNub3cgLnFsLWVkaXRvciBoNiB7XG4gIGZvbnQtc2l6ZTogMC42N2VtO1xufVxuLnFsLXNub3cgLnFsLWVkaXRvciBhIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG4ucWwtc25vdyAucWwtZWRpdG9yIGJsb2NrcXVvdGUge1xuICBib3JkZXItbGVmdDogNHB4IHNvbGlkICNjY2M7XG4gIG1hcmdpbi1ib3R0b206IDVweDtcbiAgbWFyZ2luLXRvcDogNXB4O1xuICBwYWRkaW5nLWxlZnQ6IDE2cHg7XG59XG4ucWwtc25vdyAucWwtZWRpdG9yIGNvZGUsXG4ucWwtc25vdyAucWwtZWRpdG9yIHByZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjA7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbn1cbi5xbC1zbm93IC5xbC1lZGl0b3IgcHJlIHtcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gIG1hcmdpbi10b3A6IDVweDtcbiAgcGFkZGluZzogNXB4IDEwcHg7XG59XG4ucWwtc25vdyAucWwtZWRpdG9yIGNvZGUge1xuICBmb250LXNpemU6IDg1JTtcbiAgcGFkZGluZzogMnB4IDRweDtcbn1cbi5xbC1zbm93IC5xbC1lZGl0b3IgcHJlLnFsLXN5bnRheCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMyMzI0MWY7XG4gIGNvbG9yOiAjZjhmOGYyO1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbn1cbi5xbC1zbm93IC5xbC1lZGl0b3IgaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlciB7XG4gIGNvbG9yOiAjNDQ0O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZsb2F0OiBsZWZ0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGhlaWdodDogMjRweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci1sYWJlbCB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBhZGRpbmctbGVmdDogOHB4O1xuICBwYWRkaW5nLXJpZ2h0OiAycHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDEwMCU7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLWxhYmVsOjpiZWZvcmUge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGxpbmUtaGVpZ2h0OiAyMnB4O1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci1vcHRpb25zIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgZGlzcGxheTogbm9uZTtcbiAgbWluLXdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiA0cHggOHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLW9wdGlvbnMgLnFsLXBpY2tlci1pdGVtIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBibG9jaztcbiAgcGFkZGluZy1ib3R0b206IDVweDtcbiAgcGFkZGluZy10b3A6IDVweDtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtZXhwYW5kZWQgLnFsLXBpY2tlci1sYWJlbCB7XG4gIGNvbG9yOiAjY2NjO1xuICB6LWluZGV4OiAyO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1leHBhbmRlZCAucWwtcGlja2VyLWxhYmVsIC5xbC1maWxsIHtcbiAgZmlsbDogI2NjYztcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtZXhwYW5kZWQgLnFsLXBpY2tlci1sYWJlbCAucWwtc3Ryb2tlIHtcbiAgc3Ryb2tlOiAjY2NjO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1leHBhbmRlZCAucWwtcGlja2VyLW9wdGlvbnMge1xuICBkaXNwbGF5OiBibG9jaztcbiAgbWFyZ2luLXRvcDogLTFweDtcbiAgdG9wOiAxMDAlO1xuICB6LWluZGV4OiAxO1xufVxuLnFsLXNub3cgLnFsLWNvbG9yLXBpY2tlcixcbi5xbC1zbm93IC5xbC1pY29uLXBpY2tlciB7XG4gIHdpZHRoOiAyOHB4O1xufVxuLnFsLXNub3cgLnFsLWNvbG9yLXBpY2tlciAucWwtcGlja2VyLWxhYmVsLFxuLnFsLXNub3cgLnFsLWljb24tcGlja2VyIC5xbC1waWNrZXItbGFiZWwge1xuICBwYWRkaW5nOiAycHggNHB4O1xufVxuLnFsLXNub3cgLnFsLWNvbG9yLXBpY2tlciAucWwtcGlja2VyLWxhYmVsIHN2Zyxcbi5xbC1zbm93IC5xbC1pY29uLXBpY2tlciAucWwtcGlja2VyLWxhYmVsIHN2ZyB7XG4gIHJpZ2h0OiA0cHg7XG59XG4ucWwtc25vdyAucWwtaWNvbi1waWNrZXIgLnFsLXBpY2tlci1vcHRpb25zIHtcbiAgcGFkZGluZzogNHB4IDBweDtcbn1cbi5xbC1zbm93IC5xbC1pY29uLXBpY2tlciAucWwtcGlja2VyLWl0ZW0ge1xuICBoZWlnaHQ6IDI0cHg7XG4gIHdpZHRoOiAyNHB4O1xuICBwYWRkaW5nOiAycHggNHB4O1xufVxuLnFsLXNub3cgLnFsLWNvbG9yLXBpY2tlciAucWwtcGlja2VyLW9wdGlvbnMge1xuICBwYWRkaW5nOiAzcHggNXB4O1xuICB3aWR0aDogMTUycHg7XG59XG4ucWwtc25vdyAucWwtY29sb3ItcGlja2VyIC5xbC1waWNrZXItaXRlbSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBmbG9hdDogbGVmdDtcbiAgaGVpZ2h0OiAxNnB4O1xuICBtYXJnaW46IDJweDtcbiAgcGFkZGluZzogMHB4O1xuICB3aWR0aDogMTZweDtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXI6bm90KC5xbC1jb2xvci1waWNrZXIpOm5vdCgucWwtaWNvbi1waWNrZXIpIHN2ZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbWFyZ2luLXRvcDogLTlweDtcbiAgcmlnaHQ6IDA7XG4gIHRvcDogNTAlO1xuICB3aWR0aDogMThweDtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItbGFiZWxbZGF0YS1sYWJlbF06bm90KFtkYXRhLWxhYmVsPScnXSk6OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtZm9udCAucWwtcGlja2VyLWxhYmVsW2RhdGEtbGFiZWxdOm5vdChbZGF0YS1sYWJlbD0nJ10pOjpiZWZvcmUsXG4ucWwtc25vdyAucWwtcGlja2VyLnFsLXNpemUgLnFsLXBpY2tlci1sYWJlbFtkYXRhLWxhYmVsXTpub3QoW2RhdGEtbGFiZWw9JyddKTo6YmVmb3JlLFxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1pdGVtW2RhdGEtbGFiZWxdOm5vdChbZGF0YS1sYWJlbD0nJ10pOjpiZWZvcmUsXG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWZvbnQgLnFsLXBpY2tlci1pdGVtW2RhdGEtbGFiZWxdOm5vdChbZGF0YS1sYWJlbD0nJ10pOjpiZWZvcmUsXG4ucWwtc25vdyAucWwtcGlja2VyLnFsLXNpemUgLnFsLXBpY2tlci1pdGVtW2RhdGEtbGFiZWxdOm5vdChbZGF0YS1sYWJlbD0nJ10pOjpiZWZvcmUge1xuICBjb250ZW50OiBhdHRyKGRhdGEtbGFiZWwpO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIge1xuICB3aWR0aDogOThweDtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItbGFiZWw6OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItaXRlbTo6YmVmb3JlIHtcbiAgY29udGVudDogJ05vcm1hbCc7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWhlYWRlciAucWwtcGlja2VyLWxhYmVsW2RhdGEtdmFsdWU9XCIxXCJdOjpiZWZvcmUsXG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWhlYWRlciAucWwtcGlja2VyLWl0ZW1bZGF0YS12YWx1ZT1cIjFcIl06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdIZWFkaW5nIDEnO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1sYWJlbFtkYXRhLXZhbHVlPVwiMlwiXTo6YmVmb3JlLFxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1pdGVtW2RhdGEtdmFsdWU9XCIyXCJdOjpiZWZvcmUge1xuICBjb250ZW50OiAnSGVhZGluZyAyJztcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItbGFiZWxbZGF0YS12YWx1ZT1cIjNcIl06OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPVwiM1wiXTo6YmVmb3JlIHtcbiAgY29udGVudDogJ0hlYWRpbmcgMyc7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWhlYWRlciAucWwtcGlja2VyLWxhYmVsW2RhdGEtdmFsdWU9XCI0XCJdOjpiZWZvcmUsXG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWhlYWRlciAucWwtcGlja2VyLWl0ZW1bZGF0YS12YWx1ZT1cIjRcIl06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdIZWFkaW5nIDQnO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1sYWJlbFtkYXRhLXZhbHVlPVwiNVwiXTo6YmVmb3JlLFxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1pdGVtW2RhdGEtdmFsdWU9XCI1XCJdOjpiZWZvcmUge1xuICBjb250ZW50OiAnSGVhZGluZyA1Jztcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItbGFiZWxbZGF0YS12YWx1ZT1cIjZcIl06OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPVwiNlwiXTo6YmVmb3JlIHtcbiAgY29udGVudDogJ0hlYWRpbmcgNic7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWhlYWRlciAucWwtcGlja2VyLWl0ZW1bZGF0YS12YWx1ZT1cIjFcIl06OmJlZm9yZSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1pdGVtW2RhdGEtdmFsdWU9XCIyXCJdOjpiZWZvcmUge1xuICBmb250LXNpemU6IDEuNWVtO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1pdGVtW2RhdGEtdmFsdWU9XCIzXCJdOjpiZWZvcmUge1xuICBmb250LXNpemU6IDEuMTdlbTtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtaGVhZGVyIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPVwiNFwiXTo6YmVmb3JlIHtcbiAgZm9udC1zaXplOiAxZW07XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWhlYWRlciAucWwtcGlja2VyLWl0ZW1bZGF0YS12YWx1ZT1cIjVcIl06OmJlZm9yZSB7XG4gIGZvbnQtc2l6ZTogMC44M2VtO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1oZWFkZXIgLnFsLXBpY2tlci1pdGVtW2RhdGEtdmFsdWU9XCI2XCJdOjpiZWZvcmUge1xuICBmb250LXNpemU6IDAuNjdlbTtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtZm9udCB7XG4gIHdpZHRoOiAxMDhweDtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtZm9udCAucWwtcGlja2VyLWxhYmVsOjpiZWZvcmUsXG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWZvbnQgLnFsLXBpY2tlci1pdGVtOjpiZWZvcmUge1xuICBjb250ZW50OiAnU2FucyBTZXJpZic7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWZvbnQgLnFsLXBpY2tlci1sYWJlbFtkYXRhLXZhbHVlPXNlcmlmXTo6YmVmb3JlLFxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1mb250IC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPXNlcmlmXTo6YmVmb3JlIHtcbiAgY29udGVudDogJ1NlcmlmJztcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtZm9udCAucWwtcGlja2VyLWxhYmVsW2RhdGEtdmFsdWU9bW9ub3NwYWNlXTo6YmVmb3JlLFxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1mb250IC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPW1vbm9zcGFjZV06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdNb25vc3BhY2UnO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1mb250IC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPXNlcmlmXTo6YmVmb3JlIHtcbiAgZm9udC1mYW1pbHk6IEdlb3JnaWEsIFRpbWVzIE5ldyBSb21hbiwgc2VyaWY7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLWZvbnQgLnFsLXBpY2tlci1pdGVtW2RhdGEtdmFsdWU9bW9ub3NwYWNlXTo6YmVmb3JlIHtcbiAgZm9udC1mYW1pbHk6IE1vbmFjbywgQ291cmllciBOZXcsIG1vbm9zcGFjZTtcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtc2l6ZSB7XG4gIHdpZHRoOiA5OHB4O1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1zaXplIC5xbC1waWNrZXItbGFiZWw6OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtc2l6ZSAucWwtcGlja2VyLWl0ZW06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdOb3JtYWwnO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1zaXplIC5xbC1waWNrZXItbGFiZWxbZGF0YS12YWx1ZT1zbWFsbF06OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtc2l6ZSAucWwtcGlja2VyLWl0ZW1bZGF0YS12YWx1ZT1zbWFsbF06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdTbWFsbCc7XG59XG4ucWwtc25vdyAucWwtcGlja2VyLnFsLXNpemUgLnFsLXBpY2tlci1sYWJlbFtkYXRhLXZhbHVlPWxhcmdlXTo6YmVmb3JlLFxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1zaXplIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPWxhcmdlXTo6YmVmb3JlIHtcbiAgY29udGVudDogJ0xhcmdlJztcbn1cbi5xbC1zbm93IC5xbC1waWNrZXIucWwtc2l6ZSAucWwtcGlja2VyLWxhYmVsW2RhdGEtdmFsdWU9aHVnZV06OmJlZm9yZSxcbi5xbC1zbm93IC5xbC1waWNrZXIucWwtc2l6ZSAucWwtcGlja2VyLWl0ZW1bZGF0YS12YWx1ZT1odWdlXTo6YmVmb3JlIHtcbiAgY29udGVudDogJ0h1Z2UnO1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1zaXplIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPXNtYWxsXTo6YmVmb3JlIHtcbiAgZm9udC1zaXplOiAxMHB4O1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1zaXplIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPWxhcmdlXTo6YmVmb3JlIHtcbiAgZm9udC1zaXplOiAxOHB4O1xufVxuLnFsLXNub3cgLnFsLXBpY2tlci5xbC1zaXplIC5xbC1waWNrZXItaXRlbVtkYXRhLXZhbHVlPWh1Z2VdOjpiZWZvcmUge1xuICBmb250LXNpemU6IDMycHg7XG59XG4ucWwtc25vdyAucWwtY29sb3ItcGlja2VyLnFsLWJhY2tncm91bmQgLnFsLXBpY2tlci1pdGVtIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbn1cbi5xbC1zbm93IC5xbC1jb2xvci1waWNrZXIucWwtY29sb3IgLnFsLXBpY2tlci1pdGVtIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbn1cbi5xbC10b29sYmFyLnFsLXNub3cge1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmb250LWZhbWlseTogJ0hlbHZldGljYSBOZXVlJywgJ0hlbHZldGljYScsICdBcmlhbCcsIHNhbnMtc2VyaWY7XG4gIHBhZGRpbmc6IDhweDtcbn1cbi5xbC10b29sYmFyLnFsLXNub3cgLnFsLWZvcm1hdHMge1xuICBtYXJnaW4tcmlnaHQ6IDE1cHg7XG59XG4ucWwtdG9vbGJhci5xbC1zbm93IC5xbC1waWNrZXItbGFiZWwge1xuICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbn1cbi5xbC10b29sYmFyLnFsLXNub3cgLnFsLXBpY2tlci1vcHRpb25zIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJveC1zaGFkb3c6IHJnYmEoMCwwLDAsMC4yKSAwIDJweCA4cHg7XG59XG4ucWwtdG9vbGJhci5xbC1zbm93IC5xbC1waWNrZXIucWwtZXhwYW5kZWQgLnFsLXBpY2tlci1sYWJlbCB7XG4gIGJvcmRlci1jb2xvcjogI2NjYztcbn1cbi5xbC10b29sYmFyLnFsLXNub3cgLnFsLXBpY2tlci5xbC1leHBhbmRlZCAucWwtcGlja2VyLW9wdGlvbnMge1xuICBib3JkZXItY29sb3I6ICNjY2M7XG59XG4ucWwtdG9vbGJhci5xbC1zbm93IC5xbC1jb2xvci1waWNrZXIgLnFsLXBpY2tlci1pdGVtLnFsLXNlbGVjdGVkLFxuLnFsLXRvb2xiYXIucWwtc25vdyAucWwtY29sb3ItcGlja2VyIC5xbC1waWNrZXItaXRlbTpob3ZlciB7XG4gIGJvcmRlci1jb2xvcjogIzAwMDtcbn1cbi5xbC10b29sYmFyLnFsLXNub3cgKyAucWwtY29udGFpbmVyLnFsLXNub3cge1xuICBib3JkZXItdG9wOiAwcHg7XG59XG4ucWwtc25vdyAucWwtdG9vbHRpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGJveC1zaGFkb3c6IDBweCAwcHggNXB4ICNkZGQ7XG4gIGNvbG9yOiAjNDQ0O1xuICBwYWRkaW5nOiA1cHggMTJweDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi5xbC1zbm93IC5xbC10b29sdGlwOjpiZWZvcmUge1xuICBjb250ZW50OiBcIlZpc2l0IFVSTDpcIjtcbiAgbGluZS1oZWlnaHQ6IDI2cHg7XG4gIG1hcmdpbi1yaWdodDogOHB4O1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAgaW5wdXRbdHlwZT10ZXh0XSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgaGVpZ2h0OiAyNnB4O1xuICBtYXJnaW46IDBweDtcbiAgcGFkZGluZzogM3B4IDVweDtcbiAgd2lkdGg6IDE3MHB4O1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAgYS5xbC1wcmV2aWV3IHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBtYXgtd2lkdGg6IDIwMHB4O1xuICBvdmVyZmxvdy14OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAgYS5xbC1hY3Rpb246OmFmdGVyIHtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2NjYztcbiAgY29udGVudDogJ0VkaXQnO1xuICBtYXJnaW4tbGVmdDogMTZweDtcbiAgcGFkZGluZy1yaWdodDogOHB4O1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAgYS5xbC1yZW1vdmU6OmJlZm9yZSB7XG4gIGNvbnRlbnQ6ICdSZW1vdmUnO1xuICBtYXJnaW4tbGVmdDogOHB4O1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAgYSB7XG4gIGxpbmUtaGVpZ2h0OiAyNnB4O1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXAucWwtZWRpdGluZyBhLnFsLXByZXZpZXcsXG4ucWwtc25vdyAucWwtdG9vbHRpcC5xbC1lZGl0aW5nIGEucWwtcmVtb3ZlIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5xbC1zbm93IC5xbC10b29sdGlwLnFsLWVkaXRpbmcgaW5wdXRbdHlwZT10ZXh0XSB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbi5xbC1zbm93IC5xbC10b29sdGlwLnFsLWVkaXRpbmcgYS5xbC1hY3Rpb246OmFmdGVyIHtcbiAgYm9yZGVyLXJpZ2h0OiAwcHg7XG4gIGNvbnRlbnQ6ICdTYXZlJztcbiAgcGFkZGluZy1yaWdodDogMHB4O1xufVxuLnFsLXNub3cgLnFsLXRvb2x0aXBbZGF0YS1tb2RlPWxpbmtdOjpiZWZvcmUge1xuICBjb250ZW50OiBcIkVudGVyIGxpbms6XCI7XG59XG4ucWwtc25vdyAucWwtdG9vbHRpcFtkYXRhLW1vZGU9Zm9ybXVsYV06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiRW50ZXIgZm9ybXVsYTpcIjtcbn1cbi5xbC1zbm93IC5xbC10b29sdGlwW2RhdGEtbW9kZT12aWRlb106OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiRW50ZXIgdmlkZW86XCI7XG59XG4ucWwtc25vdyBhIHtcbiAgY29sb3I6ICMwNmM7XG59XG4ucWwtY29udGFpbmVyLnFsLXNub3cge1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */", ".vex-mail-compose-editor {\n  min-height: 250px;\n}\n.vex-mail-compose-editor .ql-toolbar.ql-snow {\n  border-color: rgba(82, 63, 105, 0.12);\n  border-top-left-radius: var(--vex-border-radius);\n  border-top-right-radius: var(--vex-border-radius);\n}\n.vex-mail-compose-editor .ql-container.ql-snow {\n  border-color: rgba(82, 63, 105, 0.12);\n  border-bottom-right-radius: var(--vex-border-radius);\n  border-bottom-left-radius: var(--vex-border-radius);\n}\n.vex-mail-compose-editor .ql-editor {\n  flex: 1 1 auto;\n}\n.vex-mail-compose-editor .ql-editor.ql-blank::before {\n  font-style: normal;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-secondary-text-rgb) / var(--tw-text-opacity));\n}\n\n.vex-mail-compose-attachment {\n  border-color: rgba(82, 63, 105, 0.12);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbXBvbmVudHMvbWFpbC1jb21wb3NlL21haWwtY29tcG9zZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQTtFQUNFLGlCQUFBO0FBTkY7QUFRRTtFQUNFLHFDQVhXO0VBWVgsZ0RBQUE7RUFBQSxpREFBQTtBQU5KO0FBU0U7RUFDRSxxQ0FoQlc7RUFpQlgsb0RBQUE7RUFBQSxtREFBQTtBQVBKO0FBV0k7RUFBQTtBQUFBO0FBRUE7RUFDRSxrQkFBQTtFQUNBLG1CQUFBO0VBQUEsb0JBQUE7RUFBQSxvQkFBQTtFQUFBLDZFQUFBO0FBUk47O0FBYUE7RUFDRSxxQ0EvQmE7QUFxQmYiLCJzb3VyY2VzQ29udGVudCI6WyIkYm9yZGVyLWNvbG9yOiByZ2JhKFxuICAgIDgyLFxuICAgIDYzLFxuICAgIDEwNSxcbiAgICAwLjEyXG4pOyAvLyBFcXVhbCB0byBNYXRlcmlhbCBEZXNpZ24gT3V0bGluZSBJbnB1dCBCb3JkZXJcblxuLnZleC1tYWlsLWNvbXBvc2UtZWRpdG9yIHtcbiAgbWluLWhlaWdodDogMjUwcHg7XG5cbiAgLnFsLXRvb2xiYXIucWwtc25vdyB7XG4gICAgYm9yZGVyLWNvbG9yOiAkYm9yZGVyLWNvbG9yO1xuICAgIEBhcHBseSByb3VuZGVkLXQ7XG4gIH1cblxuICAucWwtY29udGFpbmVyLnFsLXNub3cge1xuICAgIGJvcmRlci1jb2xvcjogJGJvcmRlci1jb2xvcjtcbiAgICBAYXBwbHkgcm91bmRlZC1iO1xuICB9XG5cbiAgLnFsLWVkaXRvciB7XG4gICAgQGFwcGx5IGZsZXgtYXV0bztcblxuICAgICYucWwtYmxhbms6OmJlZm9yZSB7XG4gICAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgICBAYXBwbHkgdGV4dC1zbSB0ZXh0LXNlY29uZGFyeTtcbiAgICB9XG4gIH1cbn1cblxuLnZleC1tYWlsLWNvbXBvc2UtYXR0YWNobWVudCB7XG4gIGJvcmRlci1jb2xvcjogJGJvcmRlci1jb2xvcjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
    encapsulation: 2,
    data: {
      animation: [_vex_animations_dropdown_animation__WEBPACK_IMPORTED_MODULE_0__.dropdownAnimation]
    }
  });
}

/***/ }),

/***/ 77354:
/*!*******************************************************************************!*\
  !*** ./src/app/pages/apps/mail/components/mail-label/mail-label.component.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailLabelComponent: () => (/* binding */ MailLabelComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

class MailLabelComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function MailLabelComponent_Factory(t) {
    return new (t || MailLabelComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MailLabelComponent,
    selectors: [["vex-mail-label"]],
    inputs: {
      label: "label"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 1,
    vars: 1,
    template: function MailLabelComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.label, "\n");
      }
    },
    styles: ["[_nghost-%COMP%] {\n    display: inline-block;\n    border-radius: 9999px;\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n    padding-top: 0.25rem;\n    padding-bottom: 0.25rem;\n    font-size: 0.75rem;\n    line-height: 1rem\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbXBvbmVudHMvbWFpbC1sYWJlbC9tYWlsLWxhYmVsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0lBQUEscUJBQUE7SUFBQSxxQkFBQTtJQUFBLG9CQUFBO0lBQUEscUJBQUE7SUFBQSxvQkFBQTtJQUFBLHVCQUFBO0lBQUEsa0JBQUE7SUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBAYXBwbHkgaW5saW5lLWJsb2NrIHB4LTIgcHktMSByb3VuZGVkLWZ1bGwgdGV4dC14cztcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 4130:
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/apps/mail/components/mail-list-entry/mail-list-entry.component.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailListEntryComponent: () => (/* binding */ MailListEntryComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _vex_pipes_vex_strip_html_vex_strip_html_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/pipes/vex-strip-html/vex-strip-html.pipe */ 32337);
/* harmony import */ var _vex_pipes_vex_date_format_relative_vex_date_format_relative_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/pipes/vex-date-format-relative/vex-date-format-relative.pipe */ 41031);
/* harmony import */ var _mail_label_mail_label_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mail-label/mail-label.component */ 77354);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _services_mail_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/mail.service */ 76618);














function MailListEntryComponent_vex_mail_label_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "vex-mail-label", 17);
  }
  if (rf & 2) {
    const label_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("label", label_r1.label)("ngClass", label_r1.classes);
  }
}
const _c0 = a1 => ["./", a1];
const _c1 = a0 => ({
  "font-semibold text-default": a0
});
class MailListEntryComponent {
  constructor(cd, mailService) {
    this.cd = cd;
    this.mailService = mailService;
    this.selected = false;
    this.selectedChange = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.hovered = false;
  }
  ngOnInit() {}
  isCheckboxVisible() {
    return this.selected || this.hovered;
  }
  isStarVisible() {
    return this.mail?.starred || this.isCheckboxVisible();
  }
  onMouseEnter() {
    this.hovered = true;
    this.cd.markForCheck();
  }
  onMouseLeave() {
    this.hovered = false;
    this.cd.markForCheck();
  }
  onCheckboxChange(event) {
    this.selectedChange.emit(event.checked);
  }
  toggleStar(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.mail.starred = !this.mail.starred;
    this.cd.markForCheck();
  }
  markMailAsRead(mailId) {
    this.mailService.markMailAsRead(mailId);
  }
  static #_ = this.ɵfac = function MailListEntryComponent_Factory(t) {
    return new (t || MailListEntryComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_4__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_mail_service__WEBPACK_IMPORTED_MODULE_3__.MailService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: MailListEntryComponent,
    selectors: [["vex-mail-list-entry"]],
    inputs: {
      mail: "mail",
      selected: "selected"
    },
    outputs: {
      selectedChange: "selectedChange"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 23,
    vars: 34,
    consts: [["routerLinkActive", "active", 1, "flex", "px-4", "py-3", "transition", "ease-in-out", "duration-200", 3, "routerLink", "click", "mouseenter", "mouseleave"], [1, "flex-none", "flex", "flex-col", "ltr:pr-4", "rtl:pl-4"], [1, "w-8", "h-8", "rounded-full", "overflow-hidden", "mt-1", "flex-none"], [1, "w-full", "h-full", "object-fit", 3, "src"], [1, "w-8", "h-8", "text-center", "flex-none"], ["color", "primary", 1, "-ml-1", 3, "checked", "change", "click"], [1, "flex-1"], ["matRipple", "", 1, "flex-none", "mx-auto", "p-1", "rounded-full", "hover:bg-hover", "relative", "block", 3, "click"], [1, "icon-sm", "block", 3, "svgIcon"], [1, "truncate", "w-full"], [1, "flex", "items-end"], [1, "flex-auto", "text-base", "leading-normal", "text-secondary", 3, "ngClass"], [1, "flex-none", "text-xs", "leading-normal", "text-secondary", 3, "ngClass"], [1, "text-sm", "leading-normal", "truncate", "text-secondary", 3, "ngClass"], [1, "flex", "items-start"], [1, "text-xs", "text-secondary", "leading-tight", "truncate", "mt-1"], ["class", "ml-2 text-2xs", 3, "label", "ngClass", 4, "ngFor", "ngForOf"], [1, "ml-2", "text-2xs", 3, "label", "ngClass"]],
    template: function MailListEntryComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MailListEntryComponent_Template_a_click_0_listener() {
          return ctx.markMailAsRead(ctx.mail.id);
        })("mouseenter", function MailListEntryComponent_Template_a_mouseenter_0_listener() {
          return ctx.onMouseEnter();
        })("mouseleave", function MailListEntryComponent_Template_a_mouseleave_0_listener() {
          return ctx.onMouseLeave();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1)(2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 4)(5, "mat-checkbox", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("change", function MailListEntryComponent_Template_mat_checkbox_change_5_listener($event) {
          return ctx.onCheckboxChange($event);
        })("click", function MailListEntryComponent_Template_mat_checkbox_click_5_listener($event) {
          return $event.stopPropagation();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MailListEntryComponent_Template_div_click_7_listener($event) {
          return ctx.toggleStar($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](8, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 9)(10, "div", 10)(11, "p", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](15, "vexDateFormatRelative");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "div", 14)(19, "p", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](21, "vexStripHtml");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](22, MailListEntryComponent_vex_mail_label_22_Template, 1, 2, "vex-mail-label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("bg-hover", ctx.selected);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](26, _c0, ctx.mail.id));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("hidden", ctx.isCheckboxVisible());
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", ctx.mail.from.imgUrl, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("hidden", !ctx.isCheckboxVisible());
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("checked", ctx.selected);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("hidden", !ctx.isStarVisible());
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("text-amber-600", ctx.mail.starred);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("svgIcon", ctx.mail.starred ? "mat:star" : "mat:star_border");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](28, _c1, !ctx.mail.read));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx.mail.from.name, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](30, _c1, !ctx.mail.read));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](15, 22, ctx.mail.date), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](32, _c1, !ctx.mail.read));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx.mail.subject, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](21, 24, ctx.mail.body), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.mail.labels);
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLinkActive, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_6__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_6__.MatCheckbox, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRipple, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgFor, _mail_label_mail_label_component__WEBPACK_IMPORTED_MODULE_2__.MailLabelComponent, _vex_pipes_vex_date_format_relative_vex_date_format_relative_pipe__WEBPACK_IMPORTED_MODULE_1__.VexDateFormatRelativePipe, _vex_pipes_vex_strip_html_vex_strip_html_pipe__WEBPACK_IMPORTED_MODULE_0__.VexStripHtmlPipe],
    styles: ["a.active[_ngcontent-%COMP%] {\n\n    background-color: rgb(var(--vex-color-primary-600) / 0.1)\n}\n\na[_ngcontent-%COMP%]:not(.active):hover {\n\n    background-color: var(--vex-background-hover)\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbXBvbmVudHMvbWFpbC1saXN0LWVudHJ5L21haWwtbGlzdC1lbnRyeS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTs7SUFBQTtBQUFBOztBQUlBOztJQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJhLmFjdGl2ZSB7XG4gIEBhcHBseSBiZy1wcmltYXJ5LTYwMC8xMDtcbn1cblxuYTpub3QoLmFjdGl2ZSk6aG92ZXIge1xuICBAYXBwbHkgYmctaG92ZXI7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 21019:
/*!*********************************************************************************************!*\
  !*** ./src/app/pages/apps/mail/components/mail-sidenav-link/mail-sidenav-link.component.ts ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailSidenavLinkComponent: () => (/* binding */ MailSidenavLinkComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);






const _c0 = () => ({
  exact: false
});
class MailSidenavLinkComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function MailSidenavLinkComponent_Factory(t) {
    return new (t || MailSidenavLinkComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MailSidenavLinkComponent,
    selectors: [["vex-mail-sidenav-link"]],
    inputs: {
      link: "link"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 4,
    vars: 5,
    consts: [["matRipple", "", "routerLinkActive", "active", 1, "text-base", "flex", "items-center", "px-6", "py-2", "ltr:rounded-r-full", "rtl:rounded-l-full", "ltr:mr-6", "rtl:ml-6", "relative", "mb-2", "transition", "ease-in-out", "duration-200", "select-none", 3, "routerLinkActiveOptions", "routerLink"], [1, "block", "ltr:mr-4", "rtl:ml-4", 3, "svgIcon"], [1, "block"]],
    template: function MailSidenavLinkComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "mat-icon", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLinkActiveOptions", ctx.link.routerLinkActiveOptions || _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](4, _c0))("routerLink", ctx.link.route);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("svgIcon", ctx.link.icon);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.link.label);
      }
    },
    dependencies: [_angular_material_core__WEBPACK_IMPORTED_MODULE_1__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_1__.MatRipple, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLinkActive, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIcon],
    styles: ["a.active[_ngcontent-%COMP%] {\n\n    --tw-bg-opacity: 1;\n\n    background-color: rgb(var(--vex-color-primary-600) / var(--tw-bg-opacity));\n\n    --tw-text-opacity: 1;\n\n    color: rgb(var(--vex-color-on-primary-600) / var(--tw-text-opacity))\n}\n\na[_ngcontent-%COMP%]:not(.active):hover {\n\n    background-color: var(--vex-background-hover)\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbXBvbmVudHMvbWFpbC1zaWRlbmF2LWxpbmsvbWFpbC1zaWRlbmF2LWxpbmsuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7O0lBQUEsa0JBQUE7O0lBQUEsMEVBQUE7O0lBQUEsb0JBQUE7O0lBQUE7QUFBQTs7QUFJQTs7SUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiYS5hY3RpdmUge1xuICBAYXBwbHkgYmctcHJpbWFyeS02MDAgdGV4dC1vbi1wcmltYXJ5LTYwMDtcbn1cblxuYTpub3QoLmFjdGl2ZSk6aG92ZXIge1xuICBAYXBwbHkgYmctaG92ZXI7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 58184:
/*!***********************************************************************************!*\
  !*** ./src/app/pages/apps/mail/components/mail-sidenav/mail-sidenav.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailSidenavComponent: () => (/* binding */ MailSidenavComponent)
/* harmony export */ });
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _mail_sidenav_link_mail_sidenav_link_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mail-sidenav-link/mail-sidenav-link.component */ 21019);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);






function MailSidenavComponent_vex_mail_sidenav_link_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "vex-mail-sidenav-link", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MailSidenavComponent_vex_mail_sidenav_link_3_Template_vex_mail_sidenav_link_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r3.closeDrawer());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const link_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@fadeInUp", undefined)("link", link_r2);
  }
}
function MailSidenavComponent_vex_mail_sidenav_link_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "vex-mail-sidenav-link", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MailSidenavComponent_vex_mail_sidenav_link_6_Template_vex_mail_sidenav_link_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r6.closeDrawer());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const link_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@fadeInUp", undefined)("link", link_r5);
  }
}
class MailSidenavComponent {
  constructor(layoutService) {
    this.layoutService = layoutService;
    this.links = [{
      label: 'Inbox',
      route: ['./inbox'],
      icon: 'mat:inbox'
    }, {
      label: 'All Mails',
      route: ['./all'],
      icon: 'mat:all_inbox'
    }, {
      label: 'Starred',
      route: ['./starred'],
      icon: 'mat:star'
    }, {
      label: 'Drafts',
      route: ['./drafts'],
      icon: 'mat:drafts'
    }, {
      label: 'Sent',
      route: ['./sent'],
      icon: 'mat:send'
    }];
    this.labelLinks = [{
      label: 'Important',
      route: ['./important'],
      icon: 'mat:label_important'
    }, {
      label: 'Business',
      route: ['./business'],
      icon: 'mat:business'
    }, {
      label: 'Secret',
      route: ['./secret'],
      icon: 'mat:lock'
    }];
  }
  ngOnInit() {}
  closeDrawer() {
    if (this.layoutService.isLtLg()) {
      this.drawer?.close();
    }
  }
  static #_ = this.ɵfac = function MailSidenavComponent_Factory(t) {
    return new (t || MailSidenavComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_3__.VexLayoutService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: MailSidenavComponent,
    selectors: [["vex-mail-sidenav"]],
    inputs: {
      drawer: "drawer"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 7,
    vars: 5,
    consts: [[1, "py-4"], [1, "text-secondary", "text-xs", "font-medium", "px-6", "mb-2"], [3, "link", "click", 4, "ngFor", "ngForOf"], [1, "text-secondary", "text-xs", "font-medium", "px-6", "mt-8", "mb-2"], [3, "link", "click"]],
    template: function MailSidenavComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "p", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Browse");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, MailSidenavComponent_vex_mail_sidenav_link_3_Template, 1, 2, "vex-mail-sidenav-link", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, " Labels ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, MailSidenavComponent_vex_mail_sidenav_link_6_Template, 1, 2, "vex-mail-sidenav-link", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@stagger", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.links);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.labelLinks);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgFor, _mail_sidenav_link_mail_sidenav_link_component__WEBPACK_IMPORTED_MODULE_2__.MailSidenavLinkComponent],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_0__.stagger40ms, _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInUp400ms]
    }
  });
}

/***/ }),

/***/ 53285:
/*!*******************************************************************!*\
  !*** ./src/app/pages/apps/mail/containers/mail-list.component.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailListComponent: () => (/* binding */ MailListComponent)
/* harmony export */ });
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/utils/track-by */ 47637);
/* harmony import */ var _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/cdk/collections */ 20636);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 53317);
/* harmony import */ var _vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/utils/check-router-childs-data */ 39681);
/* harmony import */ var _components_mail_list_entry_mail_list_entry_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/mail-list-entry/mail-list-entry.component */ 4130);
/* harmony import */ var _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/components/vex-scrollbar/vex-scrollbar.component */ 19844);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _services_mail_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/mail.service */ 76618);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);






















function MailListComponent_mat_checkbox_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "mat-checkbox", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("change", function MailListComponent_mat_checkbox_1_Template_mat_checkbox_change_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r6);
      const mails_r4 = restoredCtx.ngIf;
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r5.masterToggle(mails_r4, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const mails_r4 = ctx.ngIf;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("checked", ctx_r0.isAllSelected(mails_r4))("indeterminate", ctx_r0.isSomeButNotAllSelected(mails_r4));
  }
}
function MailListComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 9)(1, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](2, "mat-icon", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](4, "mat-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](6, "mat-icon", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](8, "mat-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
  }
}
function MailListComponent_ng_container_8_vex_mail_list_entry_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "vex-mail-list-entry", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("selectedChange", function MailListComponent_ng_container_8_vex_mail_list_entry_2_Template_vex_mail_list_entry_selectedChange_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r10);
      const mail_r8 = restoredCtx.$implicit;
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"]($event ? ctx_r9.selection.select(mail_r8.id) : ctx_r9.selection.deselect(mail_r8.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const mail_r8 = ctx.$implicit;
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInUp", undefined)("mail", mail_r8)("selected", ctx_r7.selection.isSelected(mail_r8.id));
  }
}
function MailListComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "vex-scrollbar", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, MailListComponent_ng_container_8_vex_mail_list_entry_2_Template, 1, 3, "vex-mail-list-entry", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](5, "router-outlet");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@stagger", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](3, 3, ctx_r2.mails$))("ngForTrackBy", ctx_r2.trackById);
  }
}
function MailListComponent_ng_container_10_vex_scrollbar_1_vex_mail_list_entry_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "vex-mail-list-entry", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("selectedChange", function MailListComponent_ng_container_10_vex_scrollbar_1_vex_mail_list_entry_1_Template_vex_mail_list_entry_selectedChange_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r16);
      const mail_r14 = restoredCtx.$implicit;
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"]($event ? ctx_r15.selection.select(mail_r14.id) : ctx_r15.selection.deselect(mail_r14.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const mail_r14 = ctx.$implicit;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInUp", undefined)("mail", mail_r14)("selected", ctx_r13.selection.isSelected(mail_r14.id));
  }
}
function MailListComponent_ng_container_10_vex_scrollbar_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "vex-scrollbar", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, MailListComponent_ng_container_10_vex_scrollbar_1_vex_mail_list_entry_1_Template, 1, 3, "vex-mail-list-entry", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@stagger", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 3, ctx_r11.mails$))("ngForTrackBy", ctx_r11.trackById);
  }
}
function MailListComponent_ng_container_10_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "router-outlet");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function MailListComponent_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, MailListComponent_ng_container_10_vex_scrollbar_1_Template, 3, 5, "vex-scrollbar", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](3, MailListComponent_ng_container_10_div_3_Template, 2, 0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 2, ctx_r3.hasActiveMail$));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](4, 4, ctx_r3.hasActiveMail$));
  }
}
class MailListComponent {
  constructor(mailService, layoutService, router) {
    this.mailService = mailService;
    this.layoutService = layoutService;
    this.router = router;
    this.mails$ = this.mailService.filteredMails$;
    this.gtSm$ = this.layoutService.gtSm$;
    this.hasActiveMail$ = this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_10__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(() => (0,_vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_3__.getAllParams)(this.router.routerState.root.snapshot)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(params => params.has('mailId')), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.distinctUntilChanged)());
    this.trackById = _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_2__.trackById;
    this.selection = new _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_13__.SelectionModel(true, []);
  }
  ngOnInit() {}
  masterToggle(mails, change) {
    if (!mails) {
      return;
    }
    if (change.checked) {
      this.selection.select(...mails.map(mail => mail.id));
    } else {
      this.selection.deselect(...mails.map(mail => mail.id));
    }
  }
  isAllSelected(mails) {
    return mails?.length > 0 && mails?.length === this.selection.selected?.length;
  }
  isSomeButNotAllSelected(mails) {
    return !this.isAllSelected(mails) && this.selection.hasValue();
  }
  static #_ = this.ɵfac = function MailListComponent_Factory(t) {
    return new (t || MailListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_services_mail_service__WEBPACK_IMPORTED_MODULE_6__.MailService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_7__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
    type: MailListComponent,
    selectors: [["vex-mail-list"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵStandaloneFeature"]],
    decls: 12,
    vars: 10,
    consts: [[1, "vex-mail-content-header", "flex-none", "flex", "items-center", "px-6", "border-b"], ["color", "primary", 3, "checked", "indeterminate", "change", 4, "ngIf"], ["class", "ml-5 pl-3 border-l", 4, "ngIf"], [1, "flex-1"], ["color", "primary", "mat-icon-button", "", "matTooltip", "Settings", "matTooltipPosition", "below", "type", "button"], ["svgIcon", "mat:settings"], [1, "flex-auto", "grid", "grid-cols-1", "sm:grid-cols-2", "overflow-hidden"], [4, "ngIf"], ["color", "primary", 3, "checked", "indeterminate", "change"], [1, "ml-5", "pl-3", "border-l"], ["color", "primary", "mat-icon-button", "", "matTooltip", "Mark as done", "matTooltipPosition", "below", "type", "button"], ["svgIcon", "mat:check"], ["color", "primary", "mat-icon-button", "", "matTooltip", "Archive", "matTooltipPosition", "below", "type", "button", 1, "ml-1"], ["svgIcon", "mat:archive"], ["color", "primary", "mat-icon-button", "", "matTooltip", "Move to", "matTooltipPosition", "below", "type", "button", 1, "ml-1"], ["svgIcon", "mat:folder"], ["color", "primary", "mat-icon-button", "", "matTooltip", "Add Label", "matTooltipPosition", "below", "type", "button", 1, "ml-1"], ["svgIcon", "mat:label"], [1, "flex-1", "py-3"], ["class", "block", 3, "mail", "selected", "selectedChange", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "flex", "flex-col", "ltr:border-l", "rtl:border-r"], [1, "block", 3, "mail", "selected", "selectedChange"], ["class", "flex-1 py-3", 4, "ngIf"], ["class", "flex flex-col", 4, "ngIf"], [1, "flex", "flex-col"]],
    template: function MailListComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, MailListComponent_mat_checkbox_1_Template, 1, 2, "mat-checkbox", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](3, MailListComponent_div_3_Template, 9, 0, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](4, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](6, "mat-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](8, MailListComponent_ng_container_8_Template, 6, 5, "ng-container", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](9, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](10, MailListComponent_ng_container_10_Template, 5, 6, "ng-container", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](11, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 4, ctx.mails$));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.selection.hasValue());
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](9, 6, ctx.gtSm$));
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](11, 8, ctx.gtSm$));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__.MatCheckbox, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatIconButton, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip, _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__.MatIcon, _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_5__.VexScrollbarComponent, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgFor, _components_mail_list_entry_mail_list_entry_component__WEBPACK_IMPORTED_MODULE_4__.MailListEntryComponent, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_14__.AsyncPipe],
    styles: [".vex-mail-content-header[_ngcontent-%COMP%] {\n  height: 56px;\n}\n\n@media (min-width: 1280px) {\n  .vex-mail-content-header[_ngcontent-%COMP%] {\n    height: 64px;\n  }\n}\n[_nghost-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  overflow: hidden;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbnRhaW5lcnMvbWFpbC1saXN0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsWUFBQTtBQUNGOztBQUVBO0VBQ0U7SUFDRSxZQUFBO0VBQ0Y7QUFDRjtBQUdFO0VBQUEsYUFBQTtFQUFBLGNBQUE7RUFBQSxzQkFBQTtFQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIudmV4LW1haWwtY29udGVudC1oZWFkZXIge1xuICBoZWlnaHQ6IDU2cHg7XG59XG5cbkBzY3JlZW4gbGcge1xuICAudmV4LW1haWwtY29udGVudC1oZWFkZXIge1xuICAgIGhlaWdodDogNjRweDtcbiAgfVxufVxuXG46aG9zdCB7XG4gIEBhcHBseSBmbGV4IGZsZXgtY29sIGZsZXgtYXV0byBvdmVyZmxvdy1oaWRkZW47XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
    data: {
      animation: [_vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_0__.fadeInUp400ms, _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_1__.stagger40ms]
    }
  });
}

/***/ }),

/***/ 38575:
/*!*************************************************************************!*\
  !*** ./src/app/pages/apps/mail/containers/mail-view-empty.component.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailViewEmptyComponent: () => (/* binding */ MailViewEmptyComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

class MailViewEmptyComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function MailViewEmptyComponent_Factory(t) {
    return new (t || MailViewEmptyComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MailViewEmptyComponent,
    selectors: [["vex-mail-view-empty"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 4,
    vars: 0,
    consts: [[1, "vex-mail-view-empty", "flex-auto", "flex", "flex-col", "justify-center", "items-center", "p-6"], ["src", "assets/img/illustrations/new_message.svg", 1, "w-full"], [1, "text-xl", "font-semibold", "mt-4"]],
    template: function MailViewEmptyComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "p", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Select a mail to read");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      }
    },
    styles: ["[_nghost-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n}\n\n.vex-mail-view-empty[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--vex-background-card) 22px, var(--vex-background-hover) 22px, var(--vex-background-hover) 24px, transparent 24px, transparent 67px, var(--vex-background-hover) 67px, var(--vex-background-hover) 69px, transparent 69px), linear-gradient(225deg, var(--vex-background-card) 22px, var(--vex-background-hover) 22px, var(--vex-background-hover) 24px, transparent 24px, transparent 67px, var(--vex-background-hover) 67px, var(--vex-background-hover) 69px, transparent 69px) 0 64px;\n  background-color: var(--vex-background-card);\n  background-size: 64px 128px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbnRhaW5lcnMvbWFpbC12aWV3LWVtcHR5LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQUEsYUFBQTtFQUFBLGNBQUE7RUFBQTtBQUFBOztBQUdGO0VBQ0UsaWdCQUFBO0VBc0JBLDRDQUFBO0VBQ0EsMkJBQUE7QUFwQkYiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIEBhcHBseSBmbGV4LWF1dG8gZmxleCBmbGV4LWNvbDtcbn1cblxuLnZleC1tYWlsLXZpZXctZW1wdHkge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoXG4gICAgICAxMzVkZWcsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKSAyMnB4LFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpIDIycHgsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3ZlcikgMjRweCxcbiAgICAgIHRyYW5zcGFyZW50IDI0cHgsXG4gICAgICB0cmFuc3BhcmVudCA2N3B4LFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpIDY3cHgsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3ZlcikgNjlweCxcbiAgICAgIHRyYW5zcGFyZW50IDY5cHhcbiAgKSxcbiAgbGluZWFyLWdyYWRpZW50KFxuICAgICAgMjI1ZGVnLFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtY2FyZCkgMjJweCxcbiAgICAgIHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKSAyMnB4LFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpIDI0cHgsXG4gICAgICB0cmFuc3BhcmVudCAyNHB4LFxuICAgICAgdHJhbnNwYXJlbnQgNjdweCxcbiAgICAgIHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKSA2N3B4LFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpIDY5cHgsXG4gICAgICB0cmFuc3BhcmVudCA2OXB4XG4gICkgMCA2NHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKTtcbiAgYmFja2dyb3VuZC1zaXplOiA2NHB4IDEyOHB4O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 78313:
/*!*******************************************************************!*\
  !*** ./src/app/pages/apps/mail/containers/mail-view.component.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailViewComponent: () => (/* binding */ MailViewComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 33839);
/* harmony import */ var _vex_animations_dropdown_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/dropdown.animation */ 93943);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _vex_pipes_vex_date_format_relative_vex_date_format_relative_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/pipes/vex-date-format-relative/vex-date-format-relative.pipe */ 41031);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _components_mail_attachment_mail_attachment_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/mail-attachment/mail-attachment.component */ 21662);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _components_mail_label_mail_label_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/mail-label/mail-label.component */ 77354);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/components/vex-scrollbar/vex-scrollbar.component */ 19844);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _services_mail_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/mail.service */ 76618);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);






















const _c0 = () => ["../"];
function MailViewComponent_vex_scrollbar_0_a_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "a", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "mat-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction0"](1, _c0));
  }
}
function MailViewComponent_vex_scrollbar_0_vex_mail_label_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "vex-mail-label", 45);
  }
  if (rf & 2) {
    const label_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("label", label_r6.label)("ngClass", label_r6.classes);
  }
}
function MailViewComponent_vex_scrollbar_0_div_60_vex_mail_attachment_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "vex-mail-attachment", 48);
  }
  if (rf & 2) {
    const attachment_r8 = ctx.$implicit;
    const first_r9 = ctx.first;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵclassProp"]("ml-4", !first_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("attachment", attachment_r8);
  }
}
function MailViewComponent_vex_scrollbar_0_div_60_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, MailViewComponent_vex_scrollbar_0_div_60_vex_mail_attachment_1_Template, 1, 3, "vex-mail-attachment", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const mail_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", mail_r2 == null ? null : mail_r2.attachments);
  }
}
function MailViewComponent_vex_scrollbar_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "vex-scrollbar", 7)(1, "div", 8)(2, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](3, MailViewComponent_vex_scrollbar_0_a_3_Template, 2, 2, "a", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "p", 11)(6, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](8, MailViewComponent_vex_scrollbar_0_vex_mail_label_8_Template, 1, 2, "vex-mail-label", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](9, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function MailViewComponent_vex_scrollbar_0_Template_div_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r11.toggleDropdown());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "div", 14)(11, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](12, "img", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](13, "div", 17)(14, "div", 18)(15, "p", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](17, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](19, "vexDateFormatRelative");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](20, "div", 21)(21, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](22, "to me");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](23, "mat-icon", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](24, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function MailViewComponent_vex_scrollbar_0_Template_button_click_24_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](25, "mat-icon", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](26, "div", 26)(27, "div", 27)(28, "table", 28)(29, "tbody")(30, "tr")(31, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](32, "From:");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](33, "td", 30)(34, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](36, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](37, "\u2022");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](38, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](40, "tr")(41, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](42, "To:");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](43, "td", 30)(44, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](45);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](46, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](47, "\u2022");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](48, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](49);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](50, "tr")(51, "td", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](52, "Date:");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](53, "td", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](54);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](55, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](56, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function MailViewComponent_vex_scrollbar_0_Template_button_click_56_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r12);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r14.toggleDropdown());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](57, "mat-icon", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](58, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](59, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](60, MailViewComponent_vex_scrollbar_0_div_60_Template, 2, 1, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](61, "div", 38)(62, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](63, "mat-icon", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](64, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](65, " Click to ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](66, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](67, "Reply");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](68, " or ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](69, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](70, "Forward");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](71, "mat-icon", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const mail_r2 = ctx.ngIf;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](3);
    let tmp_14_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInUp", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](4, 16, ctx_r0.gtSm$));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](mail_r2 == null ? null : mail_r2.subject);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", mail_r2 == null ? null : mail_r2.labels);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("src", mail_r2 == null ? null : mail_r2.from == null ? null : mail_r2.from.imgUrl, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", mail_r2 == null ? null : mail_r2.from == null ? null : mail_r2.from.name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](19, 18, mail_r2 == null ? null : mail_r2.date), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("matMenuTriggerFor", _r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@dropdown", ctx_r0.dropdownOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](mail_r2 == null ? null : mail_r2.from == null ? null : mail_r2.from.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](mail_r2 == null ? null : mail_r2.from == null ? null : mail_r2.from.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](mail_r2 == null ? null : mail_r2.to == null ? null : mail_r2.to.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](mail_r2 == null ? null : mail_r2.to == null ? null : mail_r2.to.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind2"](55, 20, mail_r2 == null ? null : mail_r2.date, "medium"));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("innerHTML", mail_r2 == null ? null : mail_r2.body, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ((tmp_14_0 = mail_r2 == null ? null : mail_r2.attachments == null ? null : mail_r2.attachments.length) !== null && tmp_14_0 !== undefined ? tmp_14_0 : 0) > 0);
  }
}
class MailViewComponent {
  constructor(route, mailService, layoutService, cd) {
    this.route = route;
    this.mailService = mailService;
    this.layoutService = layoutService;
    this.cd = cd;
    this.mail$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.combineLatest)([this.route.paramMap.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(paramMap => paramMap.get('mailId')), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(mailId => mailId != null ? Number.parseInt(mailId) : undefined)), this.mailService.mails$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(([mailId, mails]) => mails?.find(m => m.id === mailId)));
    this.gtSm$ = this.layoutService.gtSm$;
    this.dropdownOpen = true;
  }
  ngOnInit() {}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cd.markForCheck();
  }
  ngOnDestroy() {}
  static #_ = this.ɵfac = function MailViewComponent_Factory(t) {
    return new (t || MailViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_11__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_services_mail_service__WEBPACK_IMPORTED_MODULE_6__.MailService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_7__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_8__.ChangeDetectorRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
    type: MailViewComponent,
    selectors: [["vex-mail-view"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵStandaloneFeature"]],
    decls: 16,
    vars: 3,
    consts: [["class", "flex-auto", 4, "ngIf"], ["xPosition", "before", "yPosition", "below"], ["actionsMenu", "matMenu"], ["mat-menu-item", ""], ["svgIcon", "mat:reply"], ["svgIcon", "mat:forward"], ["svgIcon", "mat:delete"], [1, "flex-auto"], [1, "p-6"], [1, "mb-6", "flex", "items-center"], ["class", "mr-4", "mat-icon-button", "", 3, "routerLink", 4, "ngIf"], [1, "text-lg", "leading-normal"], ["class", "ml-2", 3, "label", "ngClass", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "cursor-pointer", 3, "click"], [1, "flex-1", "flex", "truncate"], [1, "flex-none", "w-10", "h-10", "rounded-full", "overflow-hidden", "relative", "mr-4"], [1, "h-full", "w-full", "object-fit", 3, "src"], [1, "flex-1", "truncate"], [1, "flex", "truncate"], [1, "text-base", "flex-1", "truncate", "font-medium"], [1, "text-xs", "flex-none", "text-secondary", "truncate", "self-end"], [1, "flex", "items-center", "cursor-pointer"], [1, "text-xs", "text-secondary"], ["svgIcon", "mat:arrow_drop_down", 1, "text-secondary", "icon-sm"], ["mat-icon-button", "", "type", "button", 1, "flex-none", 3, "matMenuTriggerFor", "click"], ["svgIcon", "mat:more_vert"], [1, "overflow-hidden"], [1, "border", "rounded", "mt-4", "p-2", "pr-8", "relative"], [1, "w-full", "truncate", "table-fixed"], [1, "pr-2", "font-medium", "w-12"], [1, "truncate"], [1, "mx-2"], [1, "text-secondary"], ["mat-icon-button", "", "type", "button", 1, "absolute", "top-0", "right-0", 3, "click"], ["svgIcon", "mat:close", 1, "icon-sm"], [1, "py-4", "prose", 3, "innerHTML"], [1, "border-b"], ["class", "py-4 flex", 4, "ngIf"], ["matRipple", "", 1, "py-2", "mt-2", "rounded", "hover:bg-hover", "transition", "ease-in-out", "duration-200", "flex", "items-center", "-mx-2", "px-2", "relative", "cursor-pointer"], [1, "flex-none", "bg-primary-600/10", "text-primary-600", "rounded-full", "w-8", "h-8", "flex", "justify-center", "items-center", "mr-4"], [1, "flex-1"], [1, "font-medium"], ["svgIcon", "mat:forward", 1, "flex-none", "text-secondary"], ["mat-icon-button", "", 1, "mr-4", 3, "routerLink"], ["svgIcon", "mat:arrow_back"], [1, "ml-2", 3, "label", "ngClass"], [1, "py-4", "flex"], [3, "attachment", "ml-4", 4, "ngFor", "ngForOf"], [3, "attachment"]],
    template: function MailViewComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](0, MailViewComponent_vex_scrollbar_0_Template, 72, 23, "vex-scrollbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](1, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "mat-menu", 1, 2)(4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](5, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7, "Reply");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](9, "mat-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11, "Forward");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](12, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](13, "mat-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](14, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](15, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](1, 1, ctx.mail$));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_5__.VexScrollbarComponent, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatIconAnchor, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatIconButton, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgFor, _components_mail_label_mail_label_component__WEBPACK_IMPORTED_MODULE_4__.MailLabelComponent, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgClass, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuTrigger, _components_mail_attachment_mail_attachment_component__WEBPACK_IMPORTED_MODULE_3__.MailAttachmentComponent, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatRipple, _angular_common__WEBPACK_IMPORTED_MODULE_12__.AsyncPipe, _angular_common__WEBPACK_IMPORTED_MODULE_12__.DatePipe, _vex_pipes_vex_date_format_relative_vex_date_format_relative_pipe__WEBPACK_IMPORTED_MODULE_2__.VexDateFormatRelativePipe],
    styles: ["[_nghost-%COMP%] {\n    display: flex;\n    flex: 1 1 auto;\n    flex-direction: column;\n    overflow: hidden\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbnRhaW5lcnMvbWFpbC12aWV3LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0lBQUEsYUFBQTtJQUFBLGNBQUE7SUFBQSxzQkFBQTtJQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIEBhcHBseSBmbGV4LWF1dG8gZmxleCBmbGV4LWNvbCBvdmVyZmxvdy1oaWRkZW47XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
    data: {
      animation: [_vex_animations_dropdown_animation__WEBPACK_IMPORTED_MODULE_0__.dropdownAnimation, _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInUp400ms]
    }
  });
}

/***/ }),

/***/ 28830:
/*!**************************************************************!*\
  !*** ./src/app/pages/apps/mail/containers/mail.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailComponent: () => (/* binding */ MailComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/sidenav */ 31465);
/* harmony import */ var _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/scale-in.animation */ 62008);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _components_mail_compose_mail_compose_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/mail-compose/mail-compose.component */ 59666);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _components_mail_sidenav_mail_sidenav_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/mail-sidenav/mail-sidenav.component */ 58184);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 60839);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _services_mail_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/mail.service */ 76618);
/* harmony import */ var _vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @vex/config/vex-config.service */ 50376);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
























function MailComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Mailbox");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("@scaleIn", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("@fadeInRight", undefined);
  }
}
const _c0 = a0 => ({
  "ltr:mr-6 rtl:ml-6 mb-6": a0
});
class MailComponent {
  constructor(layoutService, mailService, configService, dialog) {
    this.layoutService = layoutService;
    this.mailService = mailService;
    this.configService = configService;
    this.dialog = dialog;
    this.isDesktop$ = this.layoutService.isDesktop$;
    this.ltLg$ = this.layoutService.ltLg$;
    this.drawerMode$ = this.isDesktop$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(isDesktop => isDesktop ? 'side' : 'over'));
    this.isVerticalLayout$ = this.configService.select(config => config.layout === 'vertical');
    this.drawerOpen = true;
    this.searchCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.UntypedFormControl();
    this.destroyRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_7__.DestroyRef);
  }
  ngOnInit() {
    /**
     * Expand Drawer when we switch from mobile to desktop view
     */
    this.isDesktop$.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__.takeUntilDestroyed)(this.destroyRef)).subscribe(isDesktop => {
      if (isDesktop) {
        this.drawer?.open();
      } else {
        this.drawer?.close();
      }
    });
    this.searchCtrl.valueChanges.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__.takeUntilDestroyed)(this.destroyRef)).subscribe(value => this.mailService.filterValue.next(value));
  }
  openCompose() {
    this.dialog.open(_components_mail_compose_mail_compose_component__WEBPACK_IMPORTED_MODULE_2__.MailComposeComponent, {
      width: '100%',
      maxWidth: 600
    });
  }
  static #_ = this.ɵfac = function MailComponent_Factory(t) {
    return new (t || MailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_4__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_services_mail_service__WEBPACK_IMPORTED_MODULE_5__.MailService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_6__.VexConfigService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
    type: MailComponent,
    selectors: [["vex-mail"]],
    viewQuery: function MailComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatDrawer, 7);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.drawer = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵStandaloneFeature"]],
    decls: 28,
    vars: 28,
    consts: [[1, "h-full", "w-full", "px-0"], [1, "h-full", "w-full"], ["position", "start", 1, "vex-mail-drawer", "max-w-3xs", "w-full", "bg-base", 3, "opened", "disableClose", "mode", "openedChange"], ["drawer", ""], [1, "vex-mail-header", "bg-primary-600/10", "px-6", "relative", "flex", "flex-col", "justify-center"], ["class", "flex-1 flex items-center", 4, "ngIf"], [1, "vex-mail-header-overflow", "flex-none", "flex", "items-center"], ["color", "primary", "mat-raised-button", "", "type", "button", 1, "w-full", 3, "click"], [3, "drawer"], [1, "bg-base", "flex", "flex-col", "overflow-hidden"], [1, "vex-mail-header", "flex-none", "bg-primary-600/10", "flex", "flex-col"], [1, "flex-auto", "flex", "items-center"], ["mat-icon-button", "", "type", "button", 1, "mx-6", "lg:hidden", 3, "click"], ["svgIcon", "mat:menu"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "w-full", "mr-6"], ["matIconPrefix", "", "svgIcon", "mat:search"], ["matInput", "", "placeholder", "Search mails...", "type", "text", 1, "bg-foreground"], [1, "vex-mail-header-overflow", "flex-none"], [1, "vex-mail-content-overflow", "flex-auto", "bg-foreground", "rounded", "shadow", "flex", "flex-col", "overflow-hidden", 3, "ngClass"], [1, "flex-1", "flex", "items-center"], [1, "text-2xl", "font-medium", "flex", "items-center"], ["svgIcon", "mat:mail", 1, "ltr:mr-4", "rtl:ml-4", "block", "icon-2xl"], [1, "block"]],
    template: function MailComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](1, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "mat-drawer-container", 1)(3, "mat-drawer", 2, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("openedChange", function MailComponent_Template_mat_drawer_openedChange_3_listener($event) {
          return ctx.drawerOpen = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](5, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](6, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](8, MailComponent_div_8_Template, 5, 2, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](9, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "div", 6)(11, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function MailComponent_Template_button_click_11_listener() {
          return ctx.openCompose();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12, " Compose ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](13, "vex-mail-sidenav", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "mat-drawer-content", 9)(15, "div", 10)(16, "div", 11)(17, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function MailComponent_Template_button_click_17_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r2);
          const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](4);
          return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](_r0.open());
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](18, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "mat-form-field", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](20, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](21, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](22, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](23, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](24, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](26, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](27, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](4);
        let tmp_2_0;
        let tmp_3_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("container", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](1, 12, ctx.isVerticalLayout$));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("opened", ctx.drawerOpen)("disableClose", (tmp_2_0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](5, 14, ctx.isDesktop$)) !== null && tmp_2_0 !== undefined ? tmp_2_0 : true)("mode", (tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](6, 16, ctx.drawerMode$)) !== null && tmp_3_0 !== undefined ? tmp_3_0 : "side");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](9, 18, ctx.isDesktop$));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("drawer", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("vex-mat-dense-xs", !_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](20, 20, ctx.isDesktop$));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("icon-sm", !_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](22, 22, ctx.isDesktop$));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](26, _c0, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](26, 24, ctx.isDesktop$)));
      }
    },
    dependencies: [_angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatSidenavModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatDrawer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatDrawerContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_12__.MatDrawerContent, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_15__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_15__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_15__.MatIconButton, _components_mail_sidenav_mail_sidenav_component__WEBPACK_IMPORTED_MODULE_3__.MailSidenavComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgClass, _angular_router__WEBPACK_IMPORTED_MODULE_16__.RouterOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_13__.AsyncPipe, _angular_material_input__WEBPACK_IMPORTED_MODULE_17__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_17__.MatInput, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__.MatPrefix],
    styles: [".vex-mail-header {\n  height: 56px;\n}\n\n@media (min-width: 1280px) {\n  .vex-mail-header {\n    height: 200px;\n  }\n  .vex-mail-header-overflow {\n    height: 64px;\n  }\n  .vex-mail-content-overflow {\n    margin-top: -64px;\n  }\n}\n.vex-mail-drawer {\n  border: 0 !important;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9tYWlsL2NvbnRhaW5lcnMvbWFpbC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNFLFlBQUE7QUFERjs7QUFJQTtFQUNFO0lBQ0UsYUFBQTtFQURGO0VBSUE7SUFDRSxZQVpLO0VBVVA7RUFLQTtJQUNFLGlCQUFBO0VBSEY7QUFDRjtBQU1BO0VBQ0Usb0JBQUE7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIiRoZWlnaHQ6IDY0cHg7XG5cbi52ZXgtbWFpbC1oZWFkZXIge1xuICBoZWlnaHQ6IDU2cHg7XG59XG5cbkBzY3JlZW4gbGcge1xuICAudmV4LW1haWwtaGVhZGVyIHtcbiAgICBoZWlnaHQ6IDIwMHB4O1xuICB9XG5cbiAgLnZleC1tYWlsLWhlYWRlci1vdmVyZmxvdyB7XG4gICAgaGVpZ2h0OiAkaGVpZ2h0O1xuICB9XG5cbiAgLnZleC1tYWlsLWNvbnRlbnQtb3ZlcmZsb3cge1xuICAgIG1hcmdpbi10b3A6IC0kaGVpZ2h0O1xuICB9XG59XG5cbi52ZXgtbWFpbC1kcmF3ZXIge1xuICBib3JkZXI6IDAgIWltcG9ydGFudDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
    encapsulation: 2,
    data: {
      animation: [_vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_0__.scaleIn400ms, _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInRight400ms]
    }
  });
}

/***/ }),

/***/ 75455:
/*!************************************************!*\
  !*** ./src/app/pages/apps/mail/mail.routes.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _containers_mail_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./containers/mail.component */ 28830);
/* harmony import */ var _containers_mail_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./containers/mail-list.component */ 53285);
/* harmony import */ var _containers_mail_view_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./containers/mail-view.component */ 78313);
/* harmony import */ var _containers_mail_view_empty_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./containers/mail-view-empty.component */ 38575);




const routes = [{
  path: '',
  component: _containers_mail_component__WEBPACK_IMPORTED_MODULE_0__.MailComponent,
  children: [{
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full'
  }, {
    path: ':filterId',
    component: _containers_mail_list_component__WEBPACK_IMPORTED_MODULE_1__.MailListComponent,
    children: [{
      path: '',
      component: _containers_mail_view_empty_component__WEBPACK_IMPORTED_MODULE_3__.MailViewEmptyComponent
    }, {
      path: ':mailId',
      component: _containers_mail_view_component__WEBPACK_IMPORTED_MODULE_2__.MailViewComponent
    }]
  }]
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (routes);

/***/ }),

/***/ 76618:
/*!**********************************************************!*\
  !*** ./src/app/pages/apps/mail/services/mail.service.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MailService: () => (/* binding */ MailService)
/* harmony export */ });
/* harmony import */ var luxon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! luxon */ 17765);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 33839);
/* harmony import */ var _static_data_fakeMails__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../static-data/fakeMails */ 5714);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 61699);





class MailService {
  constructor() {
    this.mails = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(this.sortAscending(_static_data_fakeMails__WEBPACK_IMPORTED_MODULE_1__.fakeMails));
    this.mails$ = this.mails.asObservable();
    this.filterValue = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject('');
    this.filterValue$ = this.filterValue.asObservable();
    this.filteredMails$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.combineLatest)(this.mails$, this.filterValue$).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(([mails, filterValue]) => filterValue ? mails?.filter(mail => JSON.stringify(mail).toLowerCase().includes(filterValue?.toLowerCase())) : mails));
  }
  markMailAsRead(mailId) {
    const mail = this.getMailById(mailId);
    if (!mail || mail.read) {
      return;
    }
    this.updateMail(mailId, {
      read: true
    });
  }
  updateMail(mailId, update) {
    const existingMail = this.getMailById(mailId);
    if (!existingMail) {
      return;
    }
    const mails = [...this.mails.getValue().filter(m => m.id !== mailId), {
      ...existingMail,
      ...update
    }];
    this.mails.next(this.sortAscending(mails));
  }
  sortAscending(mails) {
    return mails.slice().sort((a, b) => luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.fromISO(a.date) > luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.fromISO(b.date) ? -1 : 1);
  }
  getMailById(mailId) {
    return this.mails.getValue().find(m => m.id === mailId);
  }
  static #_ = this.ɵfac = function MailService_Factory(t) {
    return new (t || MailService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: MailService,
    factory: MailService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 5714:
/*!**************************************!*\
  !*** ./src/static-data/fakeMails.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fakeMails: () => (/* binding */ fakeMails)
/* harmony export */ });
/* harmony import */ var _ngneat_falso__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngneat/falso */ 7623);

const fakeMailLabels = [{
  label: 'Business',
  classes: ['bg-primary-600/10', 'text-primary-600']
}, {
  label: 'Secret',
  classes: ['bg-teal-600/10', 'text-teal-600']
}, {
  label: 'Important',
  classes: ['bg-warn/10', 'text-warn']
}, {
  label: 'Private',
  classes: ['bg-purple-600/10', 'text-purple-600']
}];
function createFakeMailAttachment(_seed) {
  const type = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randFileExt)();
  const imgUrl = `assets/img/demo/${(0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randNumber)({
    min: 1,
    max: 8
  })}.jpg`;
  return {
    label: (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randFileName)() + type,
    type,
    imgUrl
  };
}
function createFakeMail(id) {
  const from = {
    name: (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randFullName)(),
    email: (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randEmail)(),
    imgUrl: `assets/img/avatars/${(0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randNumber)({
      min: 1,
      max: 20
    })}.jpg`
  };
  const to = {
    name: 'David Smith',
    email: 'david.smith@example.org'
  };
  const date = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randRecentDate)({
    days: 30
  }).toISOString();
  const subject = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randSentence)();
  const body = `<p>Hey ${to.name}</p><br/><p>${(0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randParagraph)()}</p><br/><p>${(0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randParagraph)()}</p><br/><p>Best,<br/>${from.name}</p>`;
  const labels = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randBoolean)() ? [] : [fakeMailLabels[(0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randNumber)({
    min: 1,
    max: 3
  })]];
  const attachments = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randBoolean)() ? [] : createArray((0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randNumber)({
    min: 1,
    max: 3
  })).map(seed => createFakeMailAttachment(String(seed)));
  const read = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randBoolean)();
  const starred = (0,_ngneat_falso__WEBPACK_IMPORTED_MODULE_0__.randBoolean)();
  return {
    id: Number.parseInt(id),
    from,
    to,
    date,
    subject,
    body,
    labels,
    attachments,
    read,
    starred
  };
}
function createArray(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
}
const fakeMailAttachments = createArray(5).map(id => createFakeMailAttachment(String(id)));
const fakeMails = createArray(20).map(id => createFakeMail(String(id)));

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_mail_mail_routes_ts.js.map