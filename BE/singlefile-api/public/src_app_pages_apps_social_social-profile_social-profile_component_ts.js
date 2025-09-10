"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_social_social-profile_social-profile_component_ts"],{

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

/***/ 59614:
/*!*************************************************************!*\
  !*** ./src/app/core/services/user-profile-image.service.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserProfileImageService: () => (/* binding */ UserProfileImageService)
/* harmony export */ });
/* harmony import */ var _Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 71670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api-base.service */ 14461);




class UserProfileImageService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
  }
  /**
   * Subir imagen de perfil
   */
  uploadProfileImage(file) {
    const formData = new FormData();
    formData.append('profile_image', file);
    const url = this.apiBaseService.buildApiUrl('user/profile-image/upload');
    return this.http.post(url, formData);
  }
  /**
   * Obtener imagen de perfil del usuario autenticado
   */
  getProfileImage() {
    const url = this.apiBaseService.buildApiUrl('user/profile-image/get');
    return this.http.get(url);
  }
  /**
   * Obtener imagen de perfil de un usuario específico
   */
  getProfileImageById(userId) {
    const url = this.apiBaseService.buildApiUrl(`user/profile-image/get/${userId}`);
    return this.http.get(url);
  }
  /**
   * Obtener información de la imagen de perfil (sin la imagen completa)
   */
  getProfileImageInfo() {
    const url = this.apiBaseService.buildApiUrl('user/profile-image/info');
    return this.http.get(url);
  }
  /**
   * Obtener información de la imagen de perfil de un usuario específico
   */
  getProfileImageInfoById(userId) {
    const url = this.apiBaseService.buildApiUrl(`user/profile-image/info/${userId}`);
    return this.http.get(url);
  }
  /**
   * Eliminar imagen de perfil
   */
  removeProfileImage() {
    const url = this.apiBaseService.buildApiUrl('user/profile-image/remove');
    return this.http.delete(url);
  }
  /**
   * Convertir imagen base64 a URL de datos
   */
  getProfileImageUrl(imageData, imageType) {
    return `data:${imageType};base64,${imageData}`;
  }
  /**
   * Validar archivo de imagen
   */
  validateImageFile(file) {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WEBP'
      };
    }
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 5MB permitido'
      };
    }
    return {
      valid: true
    };
  }
  /**
   * Comprimir imagen antes de subir (opcional)
   */
  compressImage(file, maxWidth = 800, maxHeight = 800) {
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          // Calcular nuevas dimensiones manteniendo la proporción
          let {
            width,
            height
          } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = height * maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = width * maxHeight / height;
              height = maxHeight;
            }
          }
          // Configurar canvas
          canvas.width = width;
          canvas.height = height;
          // Dibujar imagen redimensionada
          ctx?.drawImage(img, 0, 0, width, height);
          // Convertir a blob
          canvas.toBlob(blob => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, file.type, 0.8); // Calidad 0.8
        };

        img.src = URL.createObjectURL(file);
      });
    })();
  }
  static #_ = this.ɵfac = function UserProfileImageService_Factory(t) {
    return new (t || UserProfileImageService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_1__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: UserProfileImageService,
    factory: UserProfileImageService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 10250:
/*!******************************************************************************!*\
  !*** ./src/app/pages/apps/social/social-profile/social-profile.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SocialProfileComponent: () => (/* binding */ SocialProfileComponent)
/* harmony export */ });
/* harmony import */ var _Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 71670);
/* harmony import */ var _static_data_friend_suggestions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../static-data/friend-suggestions */ 42598);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/animations/scale-in.animation */ 62008);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 60331);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 90304);
/* harmony import */ var _core_services_user_profile_image_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../core/services/user-profile-image.service */ 59614);


















function SocialProfileComponent_ng_container_77_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SocialProfileComponent_ng_container_77_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r6.removeProfileImage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3, " Eliminar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const imageInfo_r5 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" Imagen actual: ", imageInfo_r5.image_size_formatted, " ");
  }
}
function SocialProfileComponent_ng_template_79_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](0, " Sube una nueva imagen de perfil ");
  }
}
function SocialProfileComponent_div_81_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "img", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const user_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().ngIf;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("src", ctx_r9.getProfileImageUrl(user_r8), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeUrl"])("alt", "Foto de perfil de " + user_r8.name);
  }
}
function SocialProfileComponent_div_81_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "mat-icon", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, "person");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function SocialProfileComponent_div_81_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 6)(1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, SocialProfileComponent_div_81_ng_container_2_Template, 2, 2, "ng-container", 26)(3, SocialProfileComponent_div_81_ng_template_3_Template, 2, 0, "ng-template", null, 31, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "div", 20)(6, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const user_r8 = ctx.ngIf;
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](4);
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r4.getProfileImageUrl(user_r8))("ngIfElse", _r11);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](user_r8.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](user_r8.role_name);
  }
}
class SocialProfileComponent {
  constructor(authService, dialog, userProfileImageService) {
    this.authService = authService;
    this.dialog = dialog;
    this.userProfileImageService = userProfileImageService;
    this.suggestions = _static_data_friend_suggestions__WEBPACK_IMPORTED_MODULE_1__.friendSuggestions;
    this.currentUser$ = this.authService.currentUser$;
    this.profileImageInfo$ = this.userProfileImageService.getProfileImageInfo().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(response => response.success ? response.data : null));
  }
  ngOnInit() {}
  addFriend(friend) {
    friend.added = true;
  }
  removeFriend(friend) {
    friend.added = false;
  }
  trackByName(index, friend) {
    return friend.name;
  }
  openChangePasswordDialog() {
    var _this = this;
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const {
        ChangePasswordDialogComponent
      } = yield Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("src_app_pages_apps_social_change-password-dialog_index_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../change-password-dialog */ 34272));
      const dialogRef = _this.dialog.open(ChangePasswordDialogComponent, {
        width: '500px',
        disableClose: true,
        panelClass: 'change-password-dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Contraseña actualizada exitosamente');
        }
      });
    })();
  }
  uploadProfileImage(event) {
    var _this2 = this;
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const file = event.target.files[0];
      if (!file) return;
      // Validar archivo
      const validation = _this2.userProfileImageService.validateImageFile(file);
      if (!validation.valid) {
        console.error('Archivo no válido:', validation.error);
        return;
      }
      try {
        // Comprimir imagen antes de subir
        const compressedFile = yield _this2.userProfileImageService.compressImage(file);
        // Subir imagen
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.firstValueFrom)(_this2.userProfileImageService.uploadProfileImage(compressedFile));
        if (result?.success) {
          // Recargar información del usuario
          // No es necesario recargar desde el AuthService, solo actualizar la información de imagen
          _this2.refreshProfileImageInfo();
          console.log('Imagen de perfil actualizada correctamente');
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    })();
  }
  removeProfileImage() {
    var _this3 = this;
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.firstValueFrom)(_this3.userProfileImageService.removeProfileImage());
        if (result?.success) {
          // Recargar información del usuario
          // No es necesario recargar desde el AuthService, solo actualizar la información de imagen
          _this3.refreshProfileImageInfo();
          console.log('Imagen de perfil eliminada correctamente');
        }
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
      }
    })();
  }
  getProfileImageUrl(user) {
    if (user?.profile_image && user?.image_type) {
      return this.userProfileImageService.getProfileImageUrl(user.profile_image, user.image_type);
    }
    return null;
  }
  refreshProfileImageInfo() {
    this.profileImageInfo$ = this.userProfileImageService.getProfileImageInfo().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(response => response.success ? response.data : null));
  }
  static #_ = this.ɵfac = function SocialProfileComponent_Factory(t) {
    return new (t || SocialProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_6__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_core_services_user_profile_image_service__WEBPACK_IMPORTED_MODULE_7__.UserProfileImageService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
    type: SocialProfileComponent,
    selectors: [["vex-social-profile"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵStandaloneFeature"]],
    decls: 83,
    vars: 41,
    consts: [[1, "mt-6", "flex", "flex-col", "md:flex-row", "md:items-start"], [1, "flex-auto"], [1, "card"], [1, "px-6", "py-4", "border-b"], [1, "title", "m-0"], [1, "px-6", "py-4", "grid", "grid-cols-1", "sm:grid-cols-2", "gap-4"], [1, "py-3", "flex", "items-center"], [1, "w-10", "h-10", "rounded-full", "bg-primary-600/10", "text-primary-600", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center"], ["svgIcon", "mat:person", 1, "icon-sm"], [1, "m-0", "body-1"], [1, "m-0", "caption", "text-hint"], ["svgIcon", "mat:account_circle", 1, "icon-sm"], ["svgIcon", "mat:mail", 1, "icon-sm"], ["svgIcon", "mat:security", 1, "icon-sm"], ["svgIcon", "mat:check_circle", 1, "icon-sm"], [1, "w-10", "h-10", "rounded-full", "bg-gray-600/10", "text-dark", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center"], ["svgIcon", "mat:tag", 1, "icon-sm"], [1, "m-0", "body-1", "font-mono"], [1, "w-10", "h-10", "rounded-full", "bg-warning-600/10", "text-warning-600", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center", "cursor-pointer", "hover:bg-warning-600/20", "transition-colors", 3, "click"], ["svgIcon", "mat:lock", 1, "icon-sm"], [1, "flex-1"], [1, "m-0", "body-1", "cursor-pointer", "hover:text-primary-600", "transition-colors", 3, "click"], [1, "w-10", "h-10", "rounded-full", "bg-blue-600/10", "text-blue-600", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center", "cursor-pointer", "hover:bg-blue-600/20", "transition-colors"], ["type", "file", "accept", "image/*", 2, "display", "none", 3, "change"], ["fileInput", ""], ["svgIcon", "mat:photo_camera", 1, "icon-sm", "cursor-pointer", 3, "click"], [4, "ngIf", "ngIfElse"], ["noImage", ""], ["class", "py-3 flex items-center", 4, "ngIf"], ["mat-button", "", "color", "warn", 1, "ml-2", "text-xs", 3, "click"], [1, "w-16", "h-16", "rounded-full", "overflow-hidden", "bg-gray-200", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center"], ["defaultAvatar", ""], [1, "m-0", "body-1", "font-medium"], [1, "w-full", "h-full", "object-cover", 3, "src", "alt"], [1, "text-gray-400", "text-2xl"]],
    template: function SocialProfileComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](4, "h2", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "div", 5)(6, "div", 6)(7, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](8, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](9, "div")(10, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](12, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](13, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](14, "Nombre completo");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](15, "div", 6)(16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](17, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](18, "div")(19, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](21, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](22, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](23, "Usuario DMS");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](24, "div", 6)(25, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](26, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](27, "div")(28, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](30, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](31, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](32, "Correo electr\u00F3nico");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](33, "div", 6)(34, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](35, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](36, "div")(37, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](38);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](39, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](40, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](41, "Rol en el sistema");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](42, "div", 6)(43, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](44, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](45, "div")(46, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](47);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](48, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](49, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](50, "Estado de la cuenta");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](51, "div", 6)(52, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](53, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](54, "div")(55, "p", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](56);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](57, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](58, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](59, "Identificador \u00FAnico");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](60, "div", 6)(61, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SocialProfileComponent_Template_div_click_61_listener() {
          return ctx.openChangePasswordDialog();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](62, "mat-icon", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](63, "div", 20)(64, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SocialProfileComponent_Template_p_click_64_listener() {
          return ctx.openChangePasswordDialog();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](65, " Cambiar Contrase\u00F1a ");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](66, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](67, "Actualiza tu contrase\u00F1a de acceso");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](68, "div", 6)(69, "div", 22)(70, "input", 23, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("change", function SocialProfileComponent_Template_input_change_70_listener($event) {
          return ctx.uploadProfileImage($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](72, "mat-icon", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SocialProfileComponent_Template_mat_icon_click_72_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r13);
          const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](71);
          return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](_r0.click());
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](73, "div", 20)(74, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function SocialProfileComponent_Template_p_click_74_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r13);
          const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](71);
          return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](_r0.click());
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](75, " Cambiar Foto de Perfil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](76, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](77, SocialProfileComponent_ng_container_77_Template, 4, 1, "ng-container", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](78, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](79, SocialProfileComponent_ng_template_79_Template, 1, 0, "ng-template", null, 27, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](81, SocialProfileComponent_div_81_Template, 10, 4, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](82, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](80);
        let tmp_0_0;
        let tmp_1_0;
        let tmp_2_0;
        let tmp_3_0;
        let tmp_4_0;
        let tmp_5_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](12, 25, ctx.currentUser$)) == null ? null : tmp_0_0.name) || "Nombre no disponible");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](((tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](21, 27, ctx.currentUser$)) == null ? null : tmp_1_0.username) || "Usuario no disponible");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](((tmp_2_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](30, 29, ctx.currentUser$)) == null ? null : tmp_2_0.email) || "Email no disponible");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](((tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](39, 31, ctx.currentUser$)) == null ? null : tmp_3_0.role_name) || "Rol no disponible");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](((tmp_4_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](48, 33, ctx.currentUser$)) == null ? null : tmp_4_0.enabled) ? "Activo" : "Inactivo");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](((tmp_5_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](57, 35, ctx.currentUser$)) == null ? null : tmp_5_0.id) || "ID no disponible");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](78, 37, ctx.profileImageInfo$))("ngIfElse", _r3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](82, 39, ctx.currentUser$));
      }
    },
    dependencies: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__.MatDialogModule, _angular_common__WEBPACK_IMPORTED_MODULE_13__.AsyncPipe],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_2__.fadeInUp400ms, _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_3__.fadeInRight400ms, _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_4__.scaleIn400ms, _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_5__.stagger40ms]
    }
  });
}

/***/ }),

/***/ 60331:
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/firstValueFrom.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   firstValueFrom: () => (/* binding */ firstValueFrom)
/* harmony export */ });
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/EmptyError */ 31967);
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subscriber */ 58559);


function firstValueFrom(source, config) {
  const hasConfig = typeof config === 'object';
  return new Promise((resolve, reject) => {
    const subscriber = new _Subscriber__WEBPACK_IMPORTED_MODULE_0__.SafeSubscriber({
      next: value => {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: () => {
        if (hasConfig) {
          resolve(config.defaultValue);
        } else {
          reject(new _util_EmptyError__WEBPACK_IMPORTED_MODULE_1__.EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_social_social-profile_social-profile_component_ts.js.map