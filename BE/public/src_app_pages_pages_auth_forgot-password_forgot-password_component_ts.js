"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_pages_auth_forgot-password_forgot-password_component_ts"],{

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

/***/ 95213:
/*!*******************************************************************************!*\
  !*** ./src/app/pages/pages/auth/forgot-password/forgot-password.component.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForgotPasswordComponent: () => (/* binding */ ForgotPasswordComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 27947);














function ForgotPasswordComponent_mat_error_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " We can't recover your password, without your email. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class ForgotPasswordComponent {
  constructor(router, fb) {
    this.router = router;
    this.fb = fb;
    this.form = this.fb.group({
      email: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]
    });
  }
  ngOnInit() {}
  send() {
    this.router.navigate(['/']);
  }
  static #_ = this.ɵfac = function ForgotPasswordComponent_Factory(t) {
    return new (t || ForgotPasswordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ForgotPasswordComponent,
    selectors: [["vex-forgot-password"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 19,
    vars: 3,
    consts: [[1, "bg-pattern", "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center"], [1, "card", "overflow-hidden", "w-full", "max-w-md"], [1, "p-6", "pb-0", "flex", "flex-col", "items-center", "justify-center"], [1, "fill-current", "text-center"], ["src", "assets/img/icons/logos/nexusQtech.svg", 1, "w-16"], [1, "text-center", "mt-4"], [1, "title", "m-0"], [1, "body-2", "text-secondary", "m-0"], [1, "p-6", "flex", "flex-col", 3, "formGroup"], ["matIconPrefix", "", "svgIcon", "mat:mail", 1, "mr-2"], ["formControlName", "email", "matInput", "", "required", ""], [4, "ngIf"], ["color", "primary", "mat-raised-button", "", "type", "button", 1, "mt-2", 3, "click"]],
    template: function ForgotPasswordComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 5)(6, "h2", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Reset Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "h4", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " Enter your email for password recovery. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 8)(11, "mat-form-field")(12, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "E-Mail");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "mat-icon", 9)(15, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](16, ForgotPasswordComponent_mat_error_16_Template, 2, 0, "mat-error", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ForgotPasswordComponent_Template_button_click_17_listener() {
          return ctx.send();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, " SEND RECOVERY LINK ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.form.controls.email.hasError("required"));
      }
    },
    dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatError, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatPrefix, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInput, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton],
    styles: [".bg-pattern[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--vex-background-background) 22px, var(--vex-background-hover) 22px, var(--vex-background-hover) 24px, transparent 24px, transparent 67px, var(--vex-background-hover) 67px, var(--vex-background-hover) 69px, transparent 69px), linear-gradient(225deg, var(--vex-background-background) 22px, var(--vex-background-hover) 22px, var(--vex-background-hover) 24px, transparent 24px, transparent 67px, var(--vex-background-hover) 67px, var(--vex-background-hover) 69px, transparent 69px) 0 64px;\n  background-color: var(--vex-background-background);\n  background-size: 64px 128px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcGFnZXMvYXV0aC9mb3Jnb3QtcGFzc3dvcmQvZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsNmdCQUFBO0VBc0JBLGtEQUFBO0VBQ0EsMkJBQUE7QUFwQkYiLCJzb3VyY2VzQ29udGVudCI6WyIuYmctcGF0dGVybiB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudChcbiAgICAgIDEzNWRlZyxcbiAgICAgIHZhcigtLXZleC1iYWNrZ3JvdW5kLWJhY2tncm91bmQpIDIycHgsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3ZlcikgMjJweCxcbiAgICAgIHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKSAyNHB4LFxuICAgICAgdHJhbnNwYXJlbnQgMjRweCxcbiAgICAgIHRyYW5zcGFyZW50IDY3cHgsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3ZlcikgNjdweCxcbiAgICAgIHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKSA2OXB4LFxuICAgICAgdHJhbnNwYXJlbnQgNjlweFxuICApLFxuICBsaW5lYXItZ3JhZGllbnQoXG4gICAgICAyMjVkZWcsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1iYWNrZ3JvdW5kKSAyMnB4LFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpIDIycHgsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3ZlcikgMjRweCxcbiAgICAgIHRyYW5zcGFyZW50IDI0cHgsXG4gICAgICB0cmFuc3BhcmVudCA2N3B4LFxuICAgICAgdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpIDY3cHgsXG4gICAgICB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3ZlcikgNjlweCxcbiAgICAgIHRyYW5zcGFyZW50IDY5cHhcbiAgKSAwIDY0cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWJhY2tncm91bmQpO1xuICBiYWNrZ3JvdW5kLXNpemU6IDY0cHggMTI4cHg7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
    data: {
      animation: [_vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_0__.fadeInUp400ms]
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_pages_auth_forgot-password_forgot-password_component_ts.js.map