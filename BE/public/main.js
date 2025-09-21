"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["main"],{

/***/ 93943:
/*!***************************************************!*\
  !*** ./src/@vex/animations/dropdown.animation.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dropdownAnimation: () => (/* binding */ dropdownAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

const dropdownAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('dropdown', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.state)('false', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  height: 0,
  opacity: 0
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.state)('true', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  height: '*',
  opacity: 1
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)('false <=> true', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms cubic-bezier(.35, 0, .25, 1)'))]);

/***/ }),

/***/ 16412:
/*!**************************************************!*\
  !*** ./src/@vex/animations/popover.animation.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   popoverAnimation: () => (/* binding */ popoverAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

const popoverAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('transformPopover', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0,
  transform: 'scale(0.6)'
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.group)([(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('100ms linear', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('150ms cubic-bezier(0, 0, 0.2, 1)', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'scale(1)'
}))])]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('100ms linear', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0
}))])]);

/***/ }),

/***/ 26010:
/*!**********************************************************************!*\
  !*** ./src/@vex/components/vex-highlight/vex-highlight.directive.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexHighlightDirective: () => (/* binding */ VexHighlightDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_highlight_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vex-highlight.service */ 28391);



class VexHighlightDirective {
  constructor(_highlightService, _zone) {
    this._highlightService = _highlightService;
    this._zone = _zone;
    /** An optional array of language names and aliases restricting detection to only those languages.
     * The subset can also be set with configure, but the local parameter overrides the option if set.
     */
    this.languages = [];
    /** Stream that emits when code string is highlighted */
    this.highlighted = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  }
  ngOnChanges(changes) {
    if (changes['code'] && changes['code'].currentValue !== changes['code'].previousValue) {
      this.highlightElement(this.code, this.languages);
    }
  }
  /**
   * Highlighting with language detection and fix markup.
   * @param code Accepts a string with the code to highlight
   * @param languages An optional array of language names and aliases restricting detection to only those languages.
   * The subset can also be set with configure, but the local parameter overrides the option if set.
   */
  highlightElement(code, languages) {
    this._zone.runOutsideAngular(() => {
      const res = this._highlightService.highlightAuto(code, languages);
      this.highlightedCode = res.value;
      this.highlighted.emit(res);
    });
  }
  static #_ = this.ɵfac = function VexHighlightDirective_Factory(t) {
    return new (t || VexHighlightDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_vex_highlight_service__WEBPACK_IMPORTED_MODULE_0__.VexHighlightService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone));
  };
  static #_2 = this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineDirective"]({
    type: VexHighlightDirective,
    selectors: [["", "vexHighlight", ""]],
    hostVars: 3,
    hostBindings: function VexHighlightDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵhostProperty"]("innerHTML", ctx.highlightedCode, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeHtml"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("hljs", true);
      }
    },
    inputs: {
      languages: "languages",
      code: ["vexHighlight", "code"]
    },
    outputs: {
      highlighted: "highlighted"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"]]
  });
}

/***/ }),

/***/ 43260:
/*!******************************************************************!*\
  !*** ./src/@vex/components/vex-highlight/vex-highlight.model.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VEX_HIGHLIGHT_OPTIONS: () => (/* binding */ VEX_HIGHLIGHT_OPTIONS)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

const VEX_HIGHLIGHT_OPTIONS = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('HIGHLIGHT_OPTIONS');

/***/ }),

/***/ 85299:
/*!*******************************************************************!*\
  !*** ./src/@vex/components/vex-highlight/vex-highlight.module.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexHighlightModule: () => (/* binding */ VexHighlightModule),
/* harmony export */   hljsLanguages: () => (/* binding */ hljsLanguages)
/* harmony export */ });
/* harmony import */ var _vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vex-highlight.directive */ 26010);
/* harmony import */ var _vex_highlight_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vex-highlight.model */ 43260);
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! highlight.js/lib/languages/xml */ 67158);
/* harmony import */ var highlight_js_lib_languages_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! highlight.js/lib/languages/scss */ 96186);
/* harmony import */ var highlight_js_lib_languages_typescript__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! highlight.js/lib/languages/typescript */ 38499);
/* harmony import */ var _vex_highlight_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./vex-highlight.service */ 28391);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 61699);


/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */





/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */
function hljsLanguages() {
  return [{
    name: 'typescript',
    func: highlight_js_lib_languages_typescript__WEBPACK_IMPORTED_MODULE_4__["default"]
  }, {
    name: 'scss',
    func: highlight_js_lib_languages_scss__WEBPACK_IMPORTED_MODULE_3__["default"]
  }, {
    name: 'xml',
    func: highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_2__["default"]
  }];
}
class VexHighlightModule {
  static #_ = this.ɵfac = function VexHighlightModule_Factory(t) {
    return new (t || VexHighlightModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
    type: VexHighlightModule
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
    providers: [{
      provide: _vex_highlight_model__WEBPACK_IMPORTED_MODULE_1__.VEX_HIGHLIGHT_OPTIONS,
      useValue: {
        languages: hljsLanguages
      }
    }, _vex_highlight_service__WEBPACK_IMPORTED_MODULE_5__.VexHighlightService]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](VexHighlightModule, {
    imports: [_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    exports: [_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective]
  });
})();

/***/ }),

/***/ 28391:
/*!********************************************************************!*\
  !*** ./src/@vex/components/vex-highlight/vex-highlight.service.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexHighlightService: () => (/* binding */ VexHighlightService)
/* harmony export */ });
/* harmony import */ var _vex_highlight_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vex-highlight.model */ 43260);
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! highlight.js/lib/core */ 33974);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);



class VexHighlightService {
  constructor(options) {
    if (options) {
      // Register HighlightJS languages
      options.languages?.().map(language => this.registerLanguage(language.name, language.func));
      if (options.config) {
        // Set global config if present
        this.configure(options.config);
      }
    }
    // Throw an error if no languages were registered.
    if (this.listLanguages().length < 1) {
      throw new Error('[HighlightJS]: No languages were registered!');
    }
  }
  /**
   * Core highlighting function.
   * @param name Accepts a language name, or an alias
   * @param value A string with the code to highlight.
   * @param ignoreIllegals When present and evaluates to a true value, forces highlighting to finish
   * even in case of detecting illegal syntax for the language instead of throwing an exception.
   * When present, the function will restart parsing from this state instead of initializing a new one
   */
  highlight(name, value, ignoreIllegals) {
    return highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].highlight(name, value, ignoreIllegals);
  }
  /**
   * Highlighting with language detection.
   * @param value Accepts a string with the code to highlight
   * @param languageSubset An optional array of language names and aliases restricting detection to only those languages.
   * The subset can also be set with configure, but the local parameter overrides the option if set.
   */
  highlightAuto(value, languageSubset) {
    return highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].highlightAuto(value, languageSubset);
  }
  /**
   * Applies highlighting to a DOM node containing code.
   * The function uses language detection by default but you can specify the language in the class attribute of the DOM node.
   * See the class reference for all available language names and aliases.
   * @param block The element to apply highlight on.
   */
  highlightBlock(block) {
    highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].highlightBlock(block);
  }
  /**
   * Configures global options:
   */
  configure(config) {
    highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].configure(config);
  }
  /**
   * Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
   */
  initHighlighting() {
    highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].initHighlighting();
  }
  /**
   * Adds new language to the library under the specified name. Used mostly internally.
   * @param name A string with the name of the language being registered
   * @param language A function that returns an object which represents the language definition.
   * The function is passed the hljs object to be able to use common regular expressions defined within it.
   */
  registerLanguage(name, language) {
    highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].registerLanguage(name, language);
  }
  /**
   * @return The languages names list.
   */
  listLanguages() {
    return highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].listLanguages();
  }
  /**
   * Looks up a language by name or alias.
   * @param name Language name
   * @return The language object if found, undefined otherwise.
   */
  getLanguage(name) {
    return highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_1__["default"].getLanguage(name);
  }
  static #_ = this.ɵfac = function VexHighlightService_Factory(t) {
    return new (t || VexHighlightService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_vex_highlight_model__WEBPACK_IMPORTED_MODULE_0__.VEX_HIGHLIGHT_OPTIONS));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: VexHighlightService,
    factory: VexHighlightService.ɵfac
  });
}

/***/ }),

/***/ 95925:
/*!************************************************************!*\
  !*** ./src/@vex/components/vex-popover/vex-popover-ref.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexPopoverRef: () => (/* binding */ VexPopoverRef)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 72513);

class VexPopoverRef {
  constructor(overlay, content, data) {
    this.overlay = overlay;
    this.content = content;
    this.data = data;
    this.afterClosed = new rxjs__WEBPACK_IMPORTED_MODULE_0__.Subject();
    this.afterClosed$ = this.afterClosed.asObservable();
    overlay.backdropClick().subscribe(() => {
      this._close('backdropClick', undefined);
    });
  }
  close(data) {
    this._close('close', data);
  }
  _close(type, data) {
    this.overlay.dispose();
    this.afterClosed.next({
      type,
      data
    });
    this.afterClosed.complete();
  }
}

/***/ }),

/***/ 67930:
/*!******************************************************************!*\
  !*** ./src/@vex/components/vex-popover/vex-popover.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexPopoverComponent: () => (/* binding */ VexPopoverComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _animations_popover_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../animations/popover.animation */ 16412);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _vex_popover_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vex-popover-ref */ 95925);





function VexPopoverComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 4);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("innerHTML", ctx_r0.content, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
  }
}
function VexPopoverComponent_ng_container_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function VexPopoverComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, VexPopoverComponent_ng_container_3_ng_container_1_Template, 1, 0, "ng-container", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx_r1.content)("ngTemplateOutletContext", ctx_r1.context);
  }
}
function VexPopoverComponent_ng_container_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function VexPopoverComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, VexPopoverComponent_ng_container_4_ng_container_1_Template, 1, 0, "ng-container", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngComponentOutlet", ctx_r2.content);
  }
}
class VexPopoverComponent {
  constructor(popoverRef) {
    this.popoverRef = popoverRef;
    this.renderMethod = 'component';
  }
  ngOnInit() {
    this.content = this.popoverRef.content;
    if (typeof this.content === 'string') {
      this.renderMethod = 'text';
    }
    if (this.content instanceof _angular_core__WEBPACK_IMPORTED_MODULE_2__.TemplateRef) {
      this.renderMethod = 'template';
      this.context = {
        close: this.popoverRef.close.bind(this.popoverRef)
      };
    }
  }
  static #_ = this.ɵfac = function VexPopoverComponent_Factory(t) {
    return new (t || VexPopoverComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_vex_popover_ref__WEBPACK_IMPORTED_MODULE_1__.VexPopoverRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: VexPopoverComponent,
    selectors: [["vex-popover"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 5,
    vars: 5,
    consts: [[1, "vex-popover"], [3, "ngSwitch"], [3, "innerHTML", 4, "ngSwitchCase"], [4, "ngSwitchCase"], [3, "innerHTML"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [4, "ngComponentOutlet"]],
    template: function VexPopoverComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, VexPopoverComponent_div_2_Template, 1, 1, "div", 2)(3, VexPopoverComponent_ng_container_3_Template, 2, 2, "ng-container", 3)(4, VexPopoverComponent_ng_container_4_Template, 2, 1, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("@transformPopover", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitch", ctx.renderMethod);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "text");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "template");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "component");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgSwitchCase, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgComponentOutlet],
    styles: ["[_nghost-%COMP%], .vex-popover[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9AdmV4L2NvbXBvbmVudHMvdmV4LXBvcG92ZXIvdmV4LXBvcG92ZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0VBRUUsV0FBQTtFQUNBLFlBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0LFxuLnZleC1wb3BvdmVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
    data: {
      animation: [_animations_popover_animation__WEBPACK_IMPORTED_MODULE_0__.popoverAnimation]
    }
  });
}

/***/ }),

/***/ 92371:
/*!****************************************************************!*\
  !*** ./src/@vex/components/vex-popover/vex-popover.service.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexPopoverService: () => (/* binding */ VexPopoverService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/cdk/overlay */ 72698);
/* harmony import */ var _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/portal */ 83517);
/* harmony import */ var _vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vex-popover-ref */ 95925);
/* harmony import */ var _vex_popover_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vex-popover.component */ 67930);







class VexPopoverService {
  constructor(overlay, injector) {
    this.overlay = overlay;
    this.injector = injector;
  }
  open({
    origin,
    content,
    data,
    width,
    height,
    position,
    offsetX,
    offsetY
  }) {
    const overlayRef = this.overlay.create(this.getOverlayConfig({
      origin,
      width,
      height,
      position,
      offsetX,
      offsetY
    }));
    const popoverRef = new _vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__.VexPopoverRef(overlayRef, content, data);
    const injector = this.createInjector(popoverRef, this.injector);
    overlayRef.attach(new _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_2__.ComponentPortal(_vex_popover_component__WEBPACK_IMPORTED_MODULE_1__.VexPopoverComponent, null, injector));
    return popoverRef;
  }
  static getPositions() {
    return [{
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom'
    }, {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top'
    }];
  }
  createInjector(popoverRef, injector) {
    return _angular_core__WEBPACK_IMPORTED_MODULE_3__.Injector.create({
      providers: [{
        provide: _vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__.VexPopoverRef,
        useValue: popoverRef
      }],
      parent: injector
    });
  }
  getOverlayConfig({
    origin,
    width,
    height,
    position,
    offsetX,
    offsetY
  }) {
    return new _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_4__.OverlayConfig({
      hasBackdrop: true,
      width,
      height,
      backdropClass: 'vex-popover-backdrop',
      positionStrategy: this.getOverlayPosition({
        origin,
        position,
        offsetX,
        offsetY
      }),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }
  getOverlayPosition({
    origin,
    position,
    offsetX,
    offsetY
  }) {
    return this.overlay.position().flexibleConnectedTo(origin).withPositions(position || VexPopoverService.getPositions()).withFlexibleDimensions(true).withDefaultOffsetY(offsetY || 0).withDefaultOffsetX(offsetX || 0).withTransformOriginOn('.vex-popover').withPush(true);
  }
  static #_ = this.ɵfac = function VexPopoverService_Factory(t) {
    return new (t || VexPopoverService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_4__.Overlay), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_3__.Injector));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: VexPopoverService,
    factory: VexPopoverService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 6912:
/*!****************************************************************************!*\
  !*** ./src/@vex/components/vex-progress-bar/vex-progress-bar.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexProgressBarComponent: () => (/* binding */ VexProgressBarComponent)
/* harmony export */ });
/* harmony import */ var _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-loading-bar/core */ 13123);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 69134);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 13379);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/progress-bar */ 78173);
/* harmony import */ var _ngx_loading_bar_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-loading-bar/router */ 7350);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);








class VexProgressBarComponent {
  constructor(loader) {
    this.loader = loader;
    this.value$ = this.loader.useRef('router').value$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_0__.delayWhen)(value => value === 0 ? (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.interval)(200) : (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.of)(undefined)));
  }
  static #_ = this.ɵfac = function VexProgressBarComponent_Factory(t) {
    return new (t || VexProgressBarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_4__.LoadingBarService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: VexProgressBarComponent,
    selectors: [["vex-progress-bar"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵProvidersFeature"]([{
      provide: _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_4__.LOADING_BAR_CONFIG,
      useValue: {
        latencyThreshold: 80
      }
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 4,
    vars: 9,
    consts: [["mode", "determinate", 1, "progress-bar", 3, "value"]],
    template: function VexProgressBarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-progress-bar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](1, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](3, "async");
      }
      if (rf & 2) {
        let tmp_0_0;
        let tmp_1_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("visible", ((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](1, 3, ctx.value$)) !== null && tmp_0_0 !== undefined ? tmp_0_0 : 0) > 0 && ((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 5, ctx.value$)) !== null && tmp_0_0 !== undefined ? tmp_0_0 : 0) !== 100);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](3, 7, ctx.value$)) !== null && tmp_1_0 !== undefined ? tmp_1_0 : 0);
      }
    },
    dependencies: [_angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__.MatProgressBarModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__.MatProgressBar, _ngx_loading_bar_core__WEBPACK_IMPORTED_MODULE_4__.LoadingBarModule, _ngx_loading_bar_router__WEBPACK_IMPORTED_MODULE_6__.LoadingBarRouterModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.AsyncPipe],
    styles: [".progress-bar[_ngcontent-%COMP%] {\n  left: 0;\n  opacity: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  visibility: hidden;\n  z-index: 99999;\n  transition: opacity 500ms cubic-bezier(0.25, 0.8, 0.25, 1) 200ms, visibility 0ms cubic-bezier(0.25, 0.8, 0.25, 1) 700ms;\n}\n.progress-bar.visible[_ngcontent-%COMP%] {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity 500ms cubic-bezier(0.25, 0.8, 0.25, 1), visibility 0ms cubic-bezier(0.25, 0.8, 0.25, 1) 0ms;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9AdmV4L2NvbXBvbmVudHMvdmV4LXByb2dyZXNzLWJhci92ZXgtcHJvZ3Jlc3MtYmFyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0UsT0FBQTtFQUNBLFVBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtFQUNBLE1BQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSx1SEFBQTtBQUZGO0FBS0U7RUFDRSxVQUFBO0VBQ0EsbUJBQUE7RUFDQSwrR0FBQTtBQUhKIiwic291cmNlc0NvbnRlbnQiOlsiJHRyYW5zaXRpb24tZHVyYXRpb246IDUwMG1zO1xuJHRyYW5zaXRpb24tZGVsYXk6IDIwMG1zO1xuXG4ucHJvZ3Jlc3MtYmFyIHtcbiAgbGVmdDogMDtcbiAgb3BhY2l0eTogMDtcbiAgcG9zaXRpb246IGZpeGVkO1xuICByaWdodDogMDtcbiAgdG9wOiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHotaW5kZXg6IDk5OTk5O1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5ICR0cmFuc2l0aW9uLWR1cmF0aW9uIHRoZW1lKFwidHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uLm91dC1zd2lmdFwiKSAkdHJhbnNpdGlvbi1kZWxheSxcbiAgdmlzaWJpbGl0eSAwbXMgdGhlbWUoXCJ0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb24ub3V0LXN3aWZ0XCIpICgkdHJhbnNpdGlvbi1kdXJhdGlvbiArICR0cmFuc2l0aW9uLWRlbGF5KTtcblxuICAmLnZpc2libGUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5ICR0cmFuc2l0aW9uLWR1cmF0aW9uIHRoZW1lKFwidHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uLm91dC1zd2lmdFwiKSxcbiAgICB2aXNpYmlsaXR5IDBtcyB0aGVtZShcInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbi5vdXQtc3dpZnRcIikgMG1zO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
    changeDetection: 0
  });
}

/***/ }),

/***/ 19844:
/*!**********************************************************************!*\
  !*** ./src/@vex/components/vex-scrollbar/vex-scrollbar.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexScrollbarComponent: () => (/* binding */ VexScrollbarComponent)
/* harmony export */ });
/* harmony import */ var simplebar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! simplebar */ 32163);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);


const _c0 = ["*"];
class VexScrollbarComponent {
  constructor(_element, zone) {
    this._element = _element;
    this.zone = zone;
  }
  ngAfterContentInit() {
    this.zone.runOutsideAngular(() => {
      this.scrollbarRef = new simplebar__WEBPACK_IMPORTED_MODULE_0__["default"](this._element.nativeElement, this.options);
    });
  }
  ngOnDestroy() {
    /**
     * Exists, but not typed in the type definition
     * https://github.com/Grsmto/simplebar/blob/master/packages/simplebar/src/simplebar.js#L903
     */
    if (this.scrollbarRef && this.scrollbarRef.unMount) {
      this.scrollbarRef.unMount();
    }
  }
  static #_ = this.ɵfac = function VexScrollbarComponent_Factory(t) {
    return new (t || VexScrollbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: VexScrollbarComponent,
    selectors: [["vex-scrollbar"]],
    hostAttrs: [1, "vex-scrollbar"],
    inputs: {
      options: "options"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function VexScrollbarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](0);
      }
    },
    styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 0;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9AdmV4L2NvbXBvbmVudHMvdmV4LXNjcm9sbGJhci92ZXgtc2Nyb2xsYmFyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBQTtFQUNBLGFBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1pbi1oZWlnaHQ6IDA7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 7892:
/*!*****************************************!*\
  !*** ./src/@vex/config/config.token.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VEX_CONFIG: () => (/* binding */ VEX_CONFIG),
/* harmony export */   VEX_THEMES: () => (/* binding */ VEX_THEMES)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

const VEX_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('VEX_CONFIG');
const VEX_THEMES = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('VEX_THEMES');

/***/ }),

/***/ 95062:
/*!*************************************************!*\
  !*** ./src/@vex/config/vex-config.interface.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexColorScheme: () => (/* binding */ VexColorScheme),
/* harmony export */   VexConfigName: () => (/* binding */ VexConfigName),
/* harmony export */   VexTheme: () => (/* binding */ VexTheme)
/* harmony export */ });
var VexTheme;
(function (VexTheme) {
  VexTheme["DEFAULT"] = "vex-theme-default";
  VexTheme["TEAL"] = "vex-theme-teal";
})(VexTheme || (VexTheme = {}));
var VexConfigName;
(function (VexConfigName) {
  VexConfigName["apollo"] = "apollo";
  VexConfigName["zeus"] = "zeus";
  VexConfigName["hermes"] = "hermes";
  VexConfigName["poseidon"] = "poseidon";
  VexConfigName["ares"] = "ares";
  VexConfigName["ikaros"] = "ikaros";
})(VexConfigName || (VexConfigName = {}));
var VexColorScheme;
(function (VexColorScheme) {
  VexColorScheme["LIGHT"] = "light";
  VexColorScheme["DARK"] = "dark";
})(VexColorScheme || (VexColorScheme = {}));

/***/ }),

/***/ 50376:
/*!***********************************************!*\
  !*** ./src/@vex/config/vex-config.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexConfigService: () => (/* binding */ VexConfigService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/merge-deep */ 84567);
/* harmony import */ var _vex_configs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vex-configs */ 59794);
/* harmony import */ var _vex_config_interface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vex-config.interface */ 95062);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _vex_config_config_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/config/config.token */ 7892);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _services_vex_layout_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/vex-layout.service */ 64952);









class VexConfigService {
  constructor(config, themes, document, layoutService) {
    this.config = config;
    this.themes = themes;
    this.document = document;
    this.layoutService = layoutService;
    this.configMap = _vex_configs__WEBPACK_IMPORTED_MODULE_1__.vexConfigs;
    this.configs = Object.values(this.configMap);
    this._configSubject = new rxjs__WEBPACK_IMPORTED_MODULE_5__.BehaviorSubject(this.config);
    this.config$.subscribe(config => this._updateConfig(config));
  }
  get config$() {
    return this._configSubject.asObservable();
  }
  select(selector) {
    return this.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.map)(selector));
  }
  setConfig(configName) {
    const settings = this.configMap[configName];
    if (!settings) {
      throw new Error(`Config with name '${configName}' does not exist!`);
    }
    this._configSubject.next(settings);
  }
  updateConfig(config) {
    this._configSubject.next((0,_utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)({
      ...this._configSubject.getValue()
    }, config));
  }
  _updateConfig(config) {
    this._setLayoutClass(config.bodyClass);
    this._setStyle(config.style);
    this._setDensity();
    this._setDirection(config.direction);
    this._setSidenavState(config.sidenav.state);
    this._emitResize();
  }
  _setStyle(style) {
    /**
     * Set light/dark mode
     */
    switch (style.colorScheme) {
      case _vex_config_interface__WEBPACK_IMPORTED_MODULE_2__.VexColorScheme.LIGHT:
        this.document.body.classList.remove(_vex_config_interface__WEBPACK_IMPORTED_MODULE_2__.VexColorScheme.DARK);
        this.document.body.classList.add(_vex_config_interface__WEBPACK_IMPORTED_MODULE_2__.VexColorScheme.LIGHT);
        break;
      case _vex_config_interface__WEBPACK_IMPORTED_MODULE_2__.VexColorScheme.DARK:
        this.document.body.classList.remove(_vex_config_interface__WEBPACK_IMPORTED_MODULE_2__.VexColorScheme.LIGHT);
        this.document.body.classList.add(_vex_config_interface__WEBPACK_IMPORTED_MODULE_2__.VexColorScheme.DARK);
        break;
    }
    /**
     * Set theme class
     */
    this.document.body.classList.remove(...this.themes.map(t => t.className));
    this.document.body.classList.add(style.themeClassName);
    /**
     * Border Radius
     */
    this.document.body.style.setProperty('--vex-border-radius', `${style.borderRadius.value}${style.borderRadius.unit}`);
    const buttonBorderRadius = style.button.borderRadius ?? style.borderRadius;
    this.document.body.style.setProperty('--vex-button-border-radius', `${buttonBorderRadius.value}${buttonBorderRadius.unit}`);
  }
  _setDensity() {
    if (!this.document.body.classList.contains('vex-mat-dense-default')) {
      this.document.body.classList.add('vex-mat-dense-default');
    }
  }
  /**
   * Emit event so charts and other external libraries know they have to resize on layout switch
   * @private
   */
  _emitResize() {
    if (window) {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    }
  }
  _setDirection(direction) {
    this.document.body.dir = direction;
  }
  _setSidenavState(sidenavState) {
    sidenavState === 'expanded' ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }
  _setLayoutClass(bodyClass) {
    this.configs.forEach(c => {
      if (this.document.body.classList.contains(c.bodyClass)) {
        this.document.body.classList.remove(c.bodyClass);
      }
    });
    this.document.body.classList.add(bodyClass);
  }
  static #_ = this.ɵfac = function VexConfigService_Factory(t) {
    return new (t || VexConfigService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_vex_config_config_token__WEBPACK_IMPORTED_MODULE_3__.VEX_CONFIG), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_vex_config_config_token__WEBPACK_IMPORTED_MODULE_3__.VEX_THEMES), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_4__.VexLayoutService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
    token: VexConfigService,
    factory: VexConfigService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 59794:
/*!****************************************!*\
  !*** ./src/@vex/config/vex-configs.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   vexConfigs: () => (/* binding */ vexConfigs)
/* harmony export */ });
/* harmony import */ var _utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/merge-deep */ 84567);
/* harmony import */ var _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vex-config.interface */ 95062);
/* harmony import */ var _vex_utils_deep_clone__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/utils/deep-clone */ 82928);



const baseConfig = {
  id: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexConfigName.apollo,
  name: 'Apollo',
  bodyClass: 'vex-layout-apollo',
  style: {
    themeClassName: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexTheme.DEFAULT,
    colorScheme: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexColorScheme.LIGHT,
    borderRadius: {
      value: 0.5,
      unit: 'rem'
    },
    button: {
      borderRadius: {
        value: 9999,
        unit: 'px'
      }
    }
  },
  direction: 'ltr',
  imgSrc: '//vex-landing.visurel.com/assets/img/layouts/apollo.png',
  layout: 'horizontal',
  boxed: false,
  sidenav: {
    title: 'Expediente Único',
    imageUrl: 'assets/img/icons/logos/nexusQtech.svg',
    showCollapsePin: true,
    user: {
      visible: true
    },
    search: {
      visible: true
    },
    state: 'expanded'
  },
  toolbar: {
    fixed: true,
    user: {
      visible: true
    }
  },
  navbar: {
    position: 'below-toolbar'
  },
  footer: {
    visible: true,
    fixed: true
  }
};
const vexConfigs = {
  apollo: baseConfig,
  poseidon: (0,_utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)((0,_vex_utils_deep_clone__WEBPACK_IMPORTED_MODULE_2__["default"])(baseConfig), {
    id: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexConfigName.poseidon,
    name: 'Poseidon',
    bodyClass: 'vex-layout-poseidon',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/poseidon.png',
    sidenav: {
      title: 'Grupo Vanguardia',
      imageUrl: 'assets/img/icons/logos/nexusQtech.svg',
      user: {
        visible: true
      },
      search: {
        visible: true
      }
    },
    toolbar: {
      user: {
        visible: false
      }
    }
  }),
  hermes: (0,_utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)((0,_vex_utils_deep_clone__WEBPACK_IMPORTED_MODULE_2__["default"])(baseConfig), {
    id: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexConfigName.hermes,
    name: 'Hermes',
    bodyClass: 'vex-layout-hermes',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/hermes.png',
    layout: 'vertical',
    boxed: true,
    sidenav: {
      user: {
        visible: false
      },
      search: {
        visible: false
      }
    },
    toolbar: {
      fixed: false
    },
    footer: {
      fixed: false
    }
  }),
  ares: (0,_utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)((0,_vex_utils_deep_clone__WEBPACK_IMPORTED_MODULE_2__["default"])(baseConfig), {
    id: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexConfigName.ares,
    name: 'Ares',
    bodyClass: 'vex-layout-ares',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/ares.png',
    sidenav: {
      user: {
        visible: false
      },
      search: {
        visible: false
      }
    },
    toolbar: {
      fixed: false
    },
    navbar: {
      position: 'in-toolbar'
    },
    footer: {
      fixed: false
    }
  }),
  zeus: (0,_utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)((0,_vex_utils_deep_clone__WEBPACK_IMPORTED_MODULE_2__["default"])(baseConfig), {
    id: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexConfigName.zeus,
    name: 'Zeus',
    bodyClass: 'vex-layout-zeus',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/zeus.png',
    sidenav: {
      state: 'collapsed'
    }
  }),
  ikaros: (0,_utils_merge_deep__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)((0,_vex_utils_deep_clone__WEBPACK_IMPORTED_MODULE_2__["default"])(baseConfig), {
    id: _vex_config_interface__WEBPACK_IMPORTED_MODULE_1__.VexConfigName.ikaros,
    name: 'Ikaros',
    bodyClass: 'vex-layout-ikaros',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/ikaros.png',
    layout: 'vertical',
    boxed: true,
    sidenav: {
      user: {
        visible: false
      },
      search: {
        visible: false
      }
    },
    toolbar: {
      fixed: false
    },
    navbar: {
      position: 'in-toolbar'
    },
    footer: {
      fixed: false
    }
  })
};

/***/ }),

/***/ 41031:
/*!**********************************************************************************!*\
  !*** ./src/@vex/pipes/vex-date-format-relative/vex-date-format-relative.pipe.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexDateFormatRelativePipe: () => (/* binding */ VexDateFormatRelativePipe)
/* harmony export */ });
/* harmony import */ var luxon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! luxon */ 17765);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);


class VexDateFormatRelativePipe {
  transform(value, ...args) {
    if (!value) {
      return;
    }
    if (!(value instanceof luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime)) {
      value = luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.fromISO(value);
    }
    return value.toRelative();
  }
  static #_ = this.ɵfac = function VexDateFormatRelativePipe_Factory(t) {
    return new (t || VexDateFormatRelativePipe)();
  };
  static #_2 = this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
    name: "vexDateFormatRelative",
    type: VexDateFormatRelativePipe,
    pure: true,
    standalone: true
  });
}

/***/ }),

/***/ 7374:
/*!***********************************************!*\
  !*** ./src/@vex/services/vex-demo.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexDemoService: () => (/* binding */ VexDemoService)
/* harmony export */ });
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/coercion */ 55998);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/config/vex-config.service */ 50376);






class VexDemoService {
  constructor(router, configService) {
    this.router = router;
    this.configService = configService;
    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__.NavigationEnd)).subscribe(event => {
      const route = this.router.routerState.root.snapshot;
      if (route.queryParamMap.has('layout')) {
        this.configService.setConfig(route.queryParamMap.get('layout'));
      }
      if (route.queryParamMap.has('style')) {
        this.configService.updateConfig({
          style: {
            colorScheme: route.queryParamMap.get('style')
          }
        });
      }
      // TODO: Adjust primaryColor queryParam and see where it was used?
      const theme = route.queryParamMap.get('theme');
      if (theme) {
        this.configService.updateConfig({
          style: {
            themeClassName: theme
          }
        });
      }
      if (route.queryParamMap.has('rtl')) {
        this.configService.updateConfig({
          direction: (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(route.queryParamMap.get('rtl')) ? 'rtl' : 'ltr'
        });
      }
    });
  }
  static #_ = this.ɵfac = function VexDemoService_Factory(t) {
    return new (t || VexDemoService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_0__.VexConfigService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: VexDemoService,
    factory: VexDemoService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 64952:
/*!*************************************************!*\
  !*** ./src/@vex/services/vex-layout.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexLayoutService: () => (/* binding */ VexLayoutService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 60839);
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/layout */ 39743);






class VexLayoutService {
  constructor(breakpointObserver) {
    this.breakpointObserver = breakpointObserver;
    this._quickpanelOpenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.quickpanelOpen$ = this._quickpanelOpenSubject.asObservable();
    this._sidenavOpenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.sidenavOpen$ = this._sidenavOpenSubject.asObservable();
    this._sidenavCollapsedSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.sidenavCollapsed$ = this._sidenavCollapsedSubject.asObservable();
    this._sidenavCollapsedOpenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.sidenavCollapsedOpen$ = this._sidenavCollapsedOpenSubject.asObservable();
    this.destroyRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_1__.DestroyRef);
    this._configPanelOpenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this._searchOpen = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.searchOpen$ = this._searchOpen.asObservable();
    this.isDesktop$ = this.breakpointObserver.observe(`(min-width: 1280px)`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(state => state.matches));
    this.ltLg$ = this.breakpointObserver.observe(`(max-width: 1279px)`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(state => state.matches));
    this.gtMd$ = this.breakpointObserver.observe(`(min-width: 960px)`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(state => state.matches));
    this.ltMd$ = this.breakpointObserver.observe(`(max-width: 959px)`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(state => state.matches));
    this.gtSm$ = this.breakpointObserver.observe(`(min-width: 600px)`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(state => state.matches));
    this.isMobile$ = this.breakpointObserver.observe(`(max-width: 599px)`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(state => state.matches));
    this.isLtLg = () => this.breakpointObserver.isMatched(`(max-width: 1279px)`);
    this.isMobile = () => this.breakpointObserver.isMatched(`(max-width: 599px)`);
    this.configPanelOpen$ = this._configPanelOpenSubject.asObservable();
    /**
     * Expand Sidenav when we switch from mobile to desktop view
     */
    this.isDesktop$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(matches => !matches), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__.takeUntilDestroyed)(this.destroyRef)).subscribe(() => this.expandSidenav());
  }
  openQuickpanel() {
    this._quickpanelOpenSubject.next(true);
  }
  closeQuickpanel() {
    this._quickpanelOpenSubject.next(false);
  }
  openSidenav() {
    this._sidenavOpenSubject.next(true);
  }
  closeSidenav() {
    this._sidenavOpenSubject.next(false);
  }
  collapseSidenav() {
    this._sidenavCollapsedSubject.next(true);
  }
  expandSidenav() {
    this._sidenavCollapsedSubject.next(false);
  }
  collapseOpenSidenav() {
    this._sidenavCollapsedOpenSubject.next(true);
  }
  collapseCloseSidenav() {
    this._sidenavCollapsedOpenSubject.next(false);
  }
  openConfigpanel() {
    this._configPanelOpenSubject.next(true);
  }
  closeConfigpanel() {
    this._configPanelOpenSubject.next(false);
  }
  openSearch() {
    this._searchOpen.next(true);
  }
  closeSearch() {
    this._searchOpen.next(false);
  }
  static #_ = this.ɵfac = function VexLayoutService_Factory(t) {
    return new (t || VexLayoutService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__.BreakpointObserver));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: VexLayoutService,
    factory: VexLayoutService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 42355:
/*!***************************************************!*\
  !*** ./src/@vex/services/vex-platform.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexPlatformService: () => (/* binding */ VexPlatformService)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/platform */ 73274);



class VexPlatformService {
  constructor(document, rendererFactory2, platform) {
    this.document = document;
    this.rendererFactory2 = rendererFactory2;
    this.platform = platform;
    const renderer = this.rendererFactory2.createRenderer(null, null);
    if (this.platform.BLINK) {
      renderer.addClass(this.document.body, 'is-blink');
    }
  }
  static #_ = this.ɵfac = function VexPlatformService_Factory(t) {
    return new (t || VexPlatformService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.RendererFactory2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_2__.Platform));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: VexPlatformService,
    factory: VexPlatformService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 41353:
/*!********************************************************!*\
  !*** ./src/@vex/services/vex-splash-screen.service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexSplashScreenService: () => (/* binding */ VexSplashScreenService)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 81527);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/animations */ 12501);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);







class VexSplashScreenService {
  constructor(router, document, animationBuilder) {
    this.router = router;
    this.document = document;
    this.animationBuilder = animationBuilder;
    this.splashScreenElem = this.document.body.querySelector('#vex-splash-screen') ?? undefined;
    if (this.splashScreenElem) {
      this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_0__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.take)(1)).subscribe(() => this.hide());
    }
  }
  hide() {
    const player = this.animationBuilder.build([(0,_angular_animations__WEBPACK_IMPORTED_MODULE_3__.style)({
      opacity: 1
    }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_3__.animate)('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_3__.style)({
      opacity: 0
    }))]).create(this.splashScreenElem);
    player.onDone(() => this.splashScreenElem?.remove());
    player.play();
  }
  static #_ = this.ɵfac = function VexSplashScreenService_Factory(t) {
    return new (t || VexSplashScreenService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_5__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_animations__WEBPACK_IMPORTED_MODULE_3__.AnimationBuilder));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: VexSplashScreenService,
    factory: VexSplashScreenService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 39681:
/*!****************************************************!*\
  !*** ./src/@vex/utils/check-router-childs-data.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkRouterChildsData: () => (/* binding */ checkRouterChildsData),
/* harmony export */   getAllParams: () => (/* binding */ getAllParams)
/* harmony export */ });
function checkRouterChildsData(route, compareWith) {
  if (compareWith(route.data)) {
    return true;
  }
  if (!route.firstChild) {
    return false;
  }
  return checkRouterChildsData(route.firstChild, compareWith);
}
/**
 * Used to get params from children in their parent
 */
function getAllParams(route, result = new Map()) {
  if (route.params) {
    for (const key of Object.keys(route.params)) {
      result.set(key, route.params[key]);
    }
  }
  if (!route.firstChild) {
    return result;
  }
  return getAllParams(route.firstChild, result);
}

/***/ }),

/***/ 82928:
/*!**************************************!*\
  !*** ./src/@vex/utils/deep-clone.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function deepClone(obj) {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    const copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    const copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }
  const copy = {};
  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key]);
  });
  return copy;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deepClone);

/***/ }),

/***/ 75832:
/*!**********************************!*\
  !*** ./src/@vex/utils/is-nil.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isNil: () => (/* binding */ isNil)
/* harmony export */ });
function isNil(value) {
  return value == null;
}

/***/ }),

/***/ 84567:
/*!**************************************!*\
  !*** ./src/@vex/utils/merge-deep.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeDeep: () => (/* binding */ mergeDeep)
/* harmony export */ });
/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
function mergeDeep(target, source) {
  const isObject = obj => obj && typeof obj === 'object';
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
}

/***/ }),

/***/ 47637:
/*!************************************!*\
  !*** ./src/@vex/utils/track-by.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   trackById: () => (/* binding */ trackById),
/* harmony export */   trackByKey: () => (/* binding */ trackByKey),
/* harmony export */   trackByLabel: () => (/* binding */ trackByLabel),
/* harmony export */   trackByRoute: () => (/* binding */ trackByRoute),
/* harmony export */   trackByValue: () => (/* binding */ trackByValue)
/* harmony export */ });
function trackByRoute(index, item) {
  return item.route;
}
function trackById(index, item) {
  return item.id;
}
function trackByKey(index, item) {
  return item.key;
}
function trackByValue(index, value) {
  return value;
}
function trackByLabel(index, value) {
  return value.label;
}

/***/ }),

/***/ 27463:
/*!**********************************!*\
  !*** ./src/@vex/vex.provider.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   provideVex: () => (/* binding */ provideVex)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _vex_services_vex_splash_screen_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/services/vex-splash-screen.service */ 41353);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _vex_services_vex_demo_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/services/vex-demo.service */ 7374);
/* harmony import */ var _vex_services_vex_platform_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/services/vex-platform.service */ 42355);
/* harmony import */ var _vex_config_config_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/config/config.token */ 7892);
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.module */ 85299);









function provideVex(options) {
  return [(0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.importProvidersFrom)(_vex_components_vex_highlight_vex_highlight_module__WEBPACK_IMPORTED_MODULE_5__.VexHighlightModule), {
    provide: _vex_config_config_token__WEBPACK_IMPORTED_MODULE_4__.VEX_CONFIG,
    useValue: options.config
  }, {
    provide: _vex_config_config_token__WEBPACK_IMPORTED_MODULE_4__.VEX_THEMES,
    useValue: options.availableThemes
  }, {
    provide: _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MATERIAL_SANITY_CHECKS,
    useValue: {
      doctype: true,
      theme: false,
      version: true
    }
  }, {
    provide: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      appearance: 'outline'
    }
  }, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_6__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_vex_services_vex_splash_screen_service__WEBPACK_IMPORTED_MODULE_0__.VexSplashScreenService),
    multi: true
  }, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_6__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_1__.VexLayoutService),
    multi: true
  }, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_6__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_vex_services_vex_platform_service__WEBPACK_IMPORTED_MODULE_3__.VexPlatformService),
    multi: true
  }, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_6__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_vex_services_vex_demo_service__WEBPACK_IMPORTED_MODULE_2__.VexDemoService),
    multi: true
  }];
}

/***/ }),

/***/ 66401:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);


class AppComponent {
  static #_ = this.ɵfac = function AppComponent_Factory(t) {
    return new (t || AppComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: AppComponent,
    selectors: [["vex-root"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 1,
    vars: 0,
    template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
    encapsulation: 2
  });
}

/***/ }),

/***/ 7110:
/*!*******************************!*\
  !*** ./src/app/app.config.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appConfig: () => (/* binding */ appConfig)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/platform-browser */ 36480);
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.routes */ 32016);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ 24987);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 68740);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _core_icons_icons_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/icons/icons.provider */ 40214);
/* harmony import */ var _core_luxon_luxon_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/luxon/luxon.provider */ 310);
/* harmony import */ var _vex_vex_provider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/vex.provider */ 27463);
/* harmony import */ var _core_navigation_navigation_provider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/navigation/navigation.provider */ 72528);
/* harmony import */ var _vex_config_vex_configs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/config/vex-configs */ 59794);
/* harmony import */ var ngx_quill__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-quill */ 11363);
/* harmony import */ var _core_interceptors_auth_interceptor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/interceptors/auth.interceptor */ 44047);
/* harmony import */ var _core_interceptors_activity_log_interceptor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/interceptors/activity-log.interceptor */ 88152);

















const appConfig = {
  providers: [(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.importProvidersFrom)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__.BrowserModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialogModule, _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_11__.MatBottomSheetModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_12__.MatNativeDateModule), (0,_angular_router__WEBPACK_IMPORTED_MODULE_13__.provideRouter)(_app_routes__WEBPACK_IMPORTED_MODULE_0__.appRoutes,
  // TODO: Add preloading withPreloading(),
  (0,_angular_router__WEBPACK_IMPORTED_MODULE_13__.withInMemoryScrolling)({
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })), (0,_angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__.provideAnimations)(), (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_15__.provideHttpClient)((0,_angular_common_http__WEBPACK_IMPORTED_MODULE_15__.withInterceptorsFromDi)(), (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_15__.withInterceptors)([_core_interceptors_auth_interceptor__WEBPACK_IMPORTED_MODULE_6__.AuthInterceptor, _core_interceptors_activity_log_interceptor__WEBPACK_IMPORTED_MODULE_7__.ActivityLogInterceptor])), (0,_vex_vex_provider__WEBPACK_IMPORTED_MODULE_3__.provideVex)({
    /**
     * The config that will be used by default.
     * This can be changed at runtime via the config panel or using the VexConfigService.
     */
    config: _vex_config_vex_configs__WEBPACK_IMPORTED_MODULE_5__.vexConfigs.poseidon,
    /**
     * Only themes that are available in the config in tailwind.config.ts should be listed here.
     * Any theme not listed here will not be available in the config panel.
     */
    availableThemes: [{
      name: 'Default',
      className: 'vex-theme-default'
    }, {
      name: 'Teal',
      className: 'vex-theme-teal'
    }, {
      name: 'Green',
      className: 'vex-theme-green'
    }, {
      name: 'Purple',
      className: 'vex-theme-purple'
    }, {
      name: 'Red',
      className: 'vex-theme-red'
    }, {
      name: 'Orange',
      className: 'vex-theme-orange'
    }]
  }), (0,_core_navigation_navigation_provider__WEBPACK_IMPORTED_MODULE_4__.provideNavigation)(), (0,_core_icons_icons_provider__WEBPACK_IMPORTED_MODULE_1__.provideIcons)(), (0,_core_luxon_luxon_provider__WEBPACK_IMPORTED_MODULE_2__.provideLuxon)(), (0,ngx_quill__WEBPACK_IMPORTED_MODULE_16__.provideQuillConfig)({
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{
        list: 'ordered'
      }, {
        list: 'bullet'
      }], [{
        header: [1, 2, 3, 4, 5, 6, false]
      }], ['clean'], ['link', 'image']]
    }
  })]
};

/***/ }),

/***/ 32016:
/*!*******************************!*\
  !*** ./src/app/app.routes.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appRoutes: () => (/* binding */ appRoutes)
/* harmony export */ });
/* harmony import */ var _layouts_layout_layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layouts/layout/layout.component */ 78349);
/* harmony import */ var _core_guards_login_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/guards/login.guard */ 93949);
/* harmony import */ var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/guards/auth.guard */ 8036);



const appRoutes = [{
  path: 'login',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("src_app_pages_pages_auth_login_login_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/auth/login/login.component */ 26944)).then(m => m.LoginComponent),
  canActivate: [_core_guards_login_guard__WEBPACK_IMPORTED_MODULE_1__.LoginGuard]
}, {
  path: 'register',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("src_app_pages_pages_auth_register_register_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/auth/register/register.component */ 84950)).then(m => m.RegisterComponent)
}, {
  path: 'forgot-password',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("src_app_pages_pages_auth_forgot-password_forgot-password_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/auth/forgot-password/forgot-password.component */ 95213)).then(m => m.ForgotPasswordComponent)
}, {
  path: 'coming-soon',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("src_app_pages_pages_coming-soon_coming-soon_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/coming-soon/coming-soon.component */ 93325)).then(m => m.ComingSoonComponent)
}, {
  path: '',
  component: _layouts_layout_layout_component__WEBPACK_IMPORTED_MODULE_0__.LayoutComponent,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_2__.AuthGuard],
  children: [{
    path: 'dashboards/analytics',
    redirectTo: '/',
    pathMatch: 'full'
  }, {
    path: 'dashboards/admin-analytics',
    loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_tabs_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-src_app_core_services_agency_service_ts-src_app_core_services_analytics_service_ts-sr-a07ba2"), __webpack_require__.e("src_app_pages_dashboards_dashboard-admin-analytics_dashboard-admin-analytics_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/dashboards/dashboard-admin-analytics/dashboard-admin-analytics.component */ 28519)).then(m => m.DashboardAdminAnalyticsComponent)
  }, {
    path: '',
    loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("default-src_app_core_services_agency_service_ts-src_app_core_services_analytics_service_ts-sr-a07ba2"), __webpack_require__.e("src_app_pages_dashboards_dashboard-analytics_dashboard-analytics_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/dashboards/dashboard-analytics/dashboard-analytics.component */ 63843)).then(m => m.DashboardAnalyticsComponent)
  }, {
    path: 'apps',
    children: [{
      path: 'chat',
      loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-src_vex_animations_fade-in-up_animation_ts-src_vex_animations_stagger_animation_ts-no-b278f6"), __webpack_require__.e("src_app_pages_apps_chat_chat_routes_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/chat/chat.routes */ 81097))
    }, {
      path: 'mail',
      loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-src_vex_animations_fade-in-up_animation_ts-src_vex_animations_stagger_animation_ts-no-b278f6"), __webpack_require__.e("default-node_modules_ngx-quill_fesm2022_ngx-quill_mjs"), __webpack_require__.e("src_app_pages_apps_mail_mail_routes_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/mail/mail.routes */ 75455)),
      data: {
        toolbarShadowEnabled: true,
        scrollDisabled: true
      }
    }, {
      path: 'social',
      loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_material_fesm2022_tabs_mjs"), __webpack_require__.e("src_app_pages_apps_social_social_routes_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/social/social.routes */ 45466))
    }, {
      path: 'contacts',
      loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_apps_contacts_contacts_routes_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/contacts/contacts.routes */ 29925))
    }, {
      path: 'calendar',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("src_app_pages_apps_calendar_calendar_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/calendar/calendar.component */ 60894)).then(m => m.CalendarComponent),
      data: {
        toolbarShadowEnabled: true
      }
    }, {
      path: 'aio-table',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-src_vex_animations_fade-in-up_animation_ts-src_vex_animations_stagger_animation_ts-sr-381573"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_apps_aio-table_aio-table_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/aio-table/aio-table.component */ 39765)).then(m => m.AioTableComponent),
      data: {
        toolbarShadowEnabled: false
      }
    }, {
      path: 'help-center',
      loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_apps_help-center_help-center_routes_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/help-center/help-center.routes */ 88960))
    }, {
      path: 'scrumboard',
      loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_apps_scrumboard_scrumboard_routes_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/scrumboard/scrumboard.routes */ 78061))
    }, {
      path: 'editor',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_ngx-quill_fesm2022_ngx-quill_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_apps_editor_editor_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/apps/editor/editor.component */ 20612)).then(m => m.EditorComponent),
      data: {
        scrollDisabled: true
      }
    }]
  }, {
    path: 'pages',
    children: [{
      path: 'pricing',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_material_fesm2022_slide-toggle_mjs"), __webpack_require__.e("src_app_pages_pages_pricing_pricing_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/pricing/pricing.component */ 37340)).then(m => m.PricingComponent)
    }, {
      path: 'faq',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_material_fesm2022_expansion_mjs"), __webpack_require__.e("src_app_pages_pages_faq_faq_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/faq/faq.component */ 87653)).then(m => m.FaqComponent)
    }, {
      path: 'guides',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_pages_apps_help-center_help-center-guides_help-center-guides_component_ts"), __webpack_require__.e("src_app_pages_pages_guides_guides_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/guides/guides.component */ 49685)).then(m => m.GuidesComponent)
    }, {
      path: 'invoice',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_pages_invoice_invoice_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/invoice/invoice.component */ 71425)).then(m => m.InvoiceComponent)
    }, {
      path: 'error-404',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_pages_errors_error-404_error-404_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/errors/error-404/error-404.component */ 12521)).then(m => m.Error404Component)
    }, {
      path: 'error-500',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_pages_errors_error-500_error-500_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/errors/error-500/error-500.component */ 19062)).then(m => m.Error500Component)
    }]
  }, {
    path: 'ui',
    children: [{
      path: 'components',
      loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_ui_components_components_routes_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/ui/components/components.routes */ 5416))
    }, {
      path: 'forms/form-elements',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_slide-toggle_mjs"), __webpack_require__.e("default-src_vex_animations_fade-in-up_animation_ts-src_vex_animations_stagger_animation_ts-sr-25f21a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_autocomplete_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_radio_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_ui_forms_form-elements_form-elements_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/ui/forms/form-elements/form-elements.component */ 16210)).then(m => m.FormElementsComponent)
    }, {
      path: 'forms/form-wizard',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_ui_forms_form-wizard_form-wizard_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/ui/forms/form-wizard/form-wizard.component */ 18326)).then(m => m.FormWizardComponent)
    }, {
      path: 'icons',
      loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_material_fesm2022_tabs_mjs"), __webpack_require__.e("src_app_pages_ui_icons_icons_routes_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/ui/icons/icons.routes */ 40373))
    }, {
      path: 'page-layouts',
      loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_ui_page-layouts_page-layouts_routes_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/ui/page-layouts/page-layouts.routes */ 19763))
    }]
  }, {
    path: 'documentation',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_pages_documentation_documentation_routes_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/documentation/documentation.routes */ 45212))
  }, {
    path: 'configuracion',
    children: [{
      path: 'general',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_configuracion_configuracion-general_configuracion-general_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/configuracion-general/configuracion-general.component */ 57293)).then(m => m.ConfiguracionGeneralComponent)
    }, {
      path: 'documentos-requeridos',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_slide-toggle_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_configuracion_documentos-requeridos_documentos-requeridos_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/documentos-requeridos/documentos-requeridos.component */ 77394)).then(m => m.DocumentosRequeridosComponent)
    }, {
      path: 'usuarios',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_tabs_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("src_app_pages_configuracion_usuarios_usuarios_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/usuarios/usuarios.component */ 99750)).then(m => m.UsuariosComponent)
    }, {
      path: 'logs-activity',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_expansion_mjs"), __webpack_require__.e("src_app_pages_configuracion_logs-activity_logs-activity_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/logs-activity/logs-activity.component */ 66075)).then(m => m.LogsActivityComponent)
    }, {
      path: 'motivos-rechazo',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("src_app_pages_configuracion_motivos-rechazo_motivos-rechazo_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/motivos-rechazo/motivos-rechazo.component */ 93497)).then(m => m.MotivosRechazoComponent)
    }, {
      path: 'motivos-extraordinarios',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_configuracion_motivos-extraordinarios_motivos-extraordinarios_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/motivos-extraordinarios/motivos-extraordinarios.component */ 34801)).then(m => m.MotivosExtraordinariosComponent)
    }]
  }, {
    path: 'configuracion/catalogos',
    children: [{
      path: 'agencias',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("src_app_pages_configuracion_catalogos_agencias_agencias_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/catalogos/agencias/agencias.component */ 12065)).then(m => m.AgenciasComponent)
    }, {
      path: 'procesos',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_configuracion_catalogos_procesos_procesos_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/catalogos/procesos/procesos.component */ 12880)).then(m => m.ProcesosComponent)
    }, {
      path: 'tipos-operacion',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_configuracion_catalogos_tipos-operacion_tipos-operacion_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/catalogos/tipos-operacion/tipos-operacion.component */ 52135)).then(m => m.TiposOperacionComponent)
    }, {
      path: 'tipos-cliente',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_configuracion_tipos-cliente_tipos-cliente_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/tipos-cliente/tipos-cliente.component */ 66692)).then(m => m.TiposClienteComponent)
    }, {
      path: 'tipos-documento',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_configuracion_tipos-documento_tipos-documento_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/configuracion/tipos-documento/tipos-documento.component */ 62260)).then(m => m.TiposDocumentoComponent)
    }]
  }, {
    path: 'procesos',
    children: [{
      path: 'integracion',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("src_app_pages_procesos_integracion_integracion_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/procesos/integracion/integracion.component */ 47784)).then(m => m.IntegracionComponent)
    }, {
      path: 'gestion',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("src_app_pages_procesos_gestion_gestion_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/procesos/gestion/gestion.component */ 28337)).then(m => m.GestionComponent)
    }]
  }, {
    path: 'mesa-control',
    children: [{
      path: 'dashboard',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_mesa-control_dashboard_dashboard_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/mesa-control/dashboard/dashboard.component */ 41485)).then(m => m.DashboardComponent)
    }, {
      path: 'monitoreo',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_mesa-control_monitoreo_monitoreo_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/mesa-control/monitoreo/monitoreo.component */ 1733)).then(m => m.MonitoreoComponent)
    }, {
      path: 'reportes',
      loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_mesa-control_reportes_reportes_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/mesa-control/reportes/reportes.component */ 59551)).then(m => m.ReportesComponent)
    }, {
      path: 'validacion',
      loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_input_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_snack-bar_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_select_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_progress-spinner_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_table_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_checkbox_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_paginator_mjs-node_modules_angular_material_fe-67cd5a"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_card_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_datepicker_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_chips_mjs"), __webpack_require__.e("default-node_modules_angular_material_fesm2022_slide-toggle_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_mesa-control_validacion_validacion_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./pages/mesa-control/validacion/validacion.component */ 6223)).then(m => m.ValidacionComponent)
    }]
  }, {
    path: '**',
    loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_pages_pages_errors_error-404_error-404_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/pages/errors/error-404/error-404.component */ 12521)).then(m => m.Error404Component)
  }]
}];

/***/ }),

/***/ 8036:
/*!*******************************************!*\
  !*** ./src/app/core/guards/auth.guard.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthGuard: () => (/* binding */ AuthGuard)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 90304);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 27947);




class AuthGuard {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  canActivate() {
    // Verificar autenticación de forma síncrona
    const isAuthenticated = this.authService.isAuthenticated();
    const token = this.authService.getToken();
    const currentUser = this.authService.getCurrentUser();
    if (isAuthenticated && token && currentUser) {
      // Si el token necesita renovación, renovarlo automáticamente
      if (this.authService.needsTokenRefresh()) {
        console.log('🔄 Token necesita renovación, renovando automáticamente...');
        this.authService.refreshAccessToken().subscribe({
          next: response => {
            if (response.success) {
              console.log('✅ Token renovado automáticamente');
            }
          },
          error: error => {
            console.error('❌ Error renovando token:', error);
          }
        });
      }
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)(true);
    } else {
      // Usuario no autenticado, redirigir al login
      this.router.navigate(['/login']);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)(false);
    }
  }
  static #_ = this.ɵfac = function AuthGuard_Factory(t) {
    return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: AuthGuard,
    factory: AuthGuard.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 93949:
/*!********************************************!*\
  !*** ./src/app/core/guards/login.guard.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginGuard: () => (/* binding */ LoginGuard)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 90304);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 27947);




class LoginGuard {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  canActivate() {
    // Verificar autenticación de forma síncrona
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      // Usuario ya autenticado, redirigir al dashboard
      this.router.navigate(['/']);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)(false);
    } else {
      // Usuario no autenticado, permitir acceso al login
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)(true);
    }
  }
  static #_ = this.ɵfac = function LoginGuard_Factory(t) {
    return new (t || LoginGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: LoginGuard,
    factory: LoginGuard.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 40214:
/*!**********************************************!*\
  !*** ./src/app/core/icons/icons.provider.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   provideIcons: () => (/* binding */ provideIcons)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _icons_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./icons.service */ 73296);


function provideIcons() {
  return [{
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_1__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_icons_service__WEBPACK_IMPORTED_MODULE_0__.IconsService),
    multi: true
  }];
}

/***/ }),

/***/ 73296:
/*!*********************************************!*\
  !*** ./src/app/core/icons/icons.service.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IconsService: () => (/* binding */ IconsService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 36480);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ 86515);



class IconsService {
  constructor(domSanitizer, iconRegistry) {
    this.domSanitizer = domSanitizer;
    this.iconRegistry = iconRegistry;
    this.iconRegistry.addSvgIconResolver((name, namespace) => {
      switch (namespace) {
        case 'mat':
          return this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/img/icons/material-design-icons/two-tone/${name}.svg`);
        case 'logo':
          return this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/img/icons/logos/${name}.svg`);
        case 'flag':
          return this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/img/icons/flags/${name}.svg`);
        default:
          return null;
      }
    });
  }
  static #_ = this.ɵfac = function IconsService_Factory(t) {
    return new (t || IconsService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.DomSanitizer), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_material_icon__WEBPACK_IMPORTED_MODULE_2__.MatIconRegistry));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: IconsService,
    factory: IconsService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 88152:
/*!***************************************************************!*\
  !*** ./src/app/core/interceptors/activity-log.interceptor.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActivityLogInterceptor: () => (/* binding */ ActivityLogInterceptor)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 13738);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _services_activity_log_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/activity-log.service */ 41882);




/**
 * Interceptor para registrar actividades del usuario
 * SOLO registra las siguientes acciones:
 * - LOGIN: Inicio de sesión
 * - LOGOUT: Cierre de sesión
 * - CREATE: Creación de registros
 * - UPDATE: Actualización de registros
 * - DELETE: Eliminación de registros
 * - EXPORT: Exportación de datos
 *
 * NO registra: búsquedas, visualizaciones, estadísticas, etc.
 */
const ActivityLogInterceptor = (request, next) => {
  const activityLogService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_activity_log_service__WEBPACK_IMPORTED_MODULE_0__.ActivityLogService);
  const startTime = Date.now();
  // No loggear peticiones de logs para evitar recursión
  if (request.url.includes('user-activity-logs')) {
    return next(request);
  }
  return next(request).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(event => {
    if (event instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpResponse) {
      const executionTime = Date.now() - startTime;
      // Determinar la acción basada en la URL y método
      const action = determineAction(request.url, request.method);
      if (action) {
        // Capturar detalles del cambio basado en el tipo de acción
        const changeDetails = getChangeDetails(request, event, action);
        activityLogService.logUserAction(action.type, action.description, {
          change_details: changeDetails
        });
      }
    }
  }));
};
/**
 * Determinar la acción basada en la URL y método HTTP
 */
function determineAction(url, method) {
  // Login
  if (url.includes('/auth/login') && method === 'POST') {
    return {
      type: 'LOGIN',
      description: 'Inicio de sesión'
    };
  }
  // Logout
  if (url.includes('/auth/logout') && method === 'POST') {
    return {
      type: 'LOGOUT',
      description: 'Cierre de sesión'
    };
  }
  // Crear registros
  if (method === 'POST' && !url.includes('/auth/')) {
    const entity = extractEntityFromUrl(url);
    return {
      type: 'CREATE',
      description: `Creación de ${entity}`
    };
  }
  // Actualizar registros
  if (method === 'PUT' || method === 'PATCH') {
    const entity = extractEntityFromUrl(url);
    return {
      type: 'UPDATE',
      description: `Actualización de ${entity}`
    };
  }
  // Eliminar registros
  if (method === 'DELETE') {
    const entity = extractEntityFromUrl(url);
    return {
      type: 'DELETE',
      description: `Eliminación de ${entity}`
    };
  }
  // Exportar datos
  if (url.includes('/export') || url.includes('/download') || url.includes('/excel')) {
    const entity = extractEntityFromUrl(url);
    return {
      type: 'EXPORT',
      description: `Exportación de ${entity}`
    };
  }
  // Solo registrar las acciones especificadas: LOGIN, LOGOUT, CREATE, UPDATE, DELETE, EXPORT
  // No registrar: SEARCH, VIEW, VIEW_STATS, etc.
  return null;
}
/**
 * Obtener detalles específicos del cambio realizado
 */
function getChangeDetails(request, response, action) {
  try {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    // Construir objeto con toda la información de la request
    const requestInfo = {
      method: method,
      url: url,
      timestamp: new Date().toISOString()
    };
    // Agregar body si existe
    if (body && typeof body === 'object') {
      requestInfo.requestBody = body;
    }
    // Agregar parámetros de query si existen
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    if (urlParams.toString()) {
      const queryParams = {};
      urlParams.forEach((value, key) => {
        // Sanitizar parámetros de query
        if (isSensitiveField(key)) {
          queryParams[key] = '[CAMPO SENSIBLE OCULTO]';
        } else {
          queryParams[key] = value;
        }
      });
      requestInfo.queryParams = queryParams;
    }
    // Detalles específicos según el tipo de acción
    switch (action.type) {
      case 'LOGIN':
        // Para login, mostrar información básica sin datos sensibles
        const loginInfo = {
          action: 'LOGIN',
          timestamp: new Date().toISOString(),
          url: url,
          method: method,
          note: 'Datos de autenticación ocultos por seguridad'
        };
        return `Usuario inició sesión en el sistema - ${JSON.stringify(loginInfo)}`;
      case 'LOGOUT':
        // Para logout, mostrar información básica
        const logoutInfo = {
          action: 'LOGOUT',
          timestamp: new Date().toISOString(),
          url: url,
          method: method
        };
        return `Usuario cerró sesión del sistema - ${JSON.stringify(logoutInfo)}`;
      case 'CREATE':
        const entity = extractEntityFromUrl(url);
        return `Creación de ${entity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
      case 'UPDATE':
        const updateEntity = extractEntityFromUrl(url);
        return `Actualización de ${updateEntity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
      case 'DELETE':
        const deleteEntity = extractEntityFromUrl(url);
        return `Eliminación de ${deleteEntity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
      case 'EXPORT':
        const exportEntity = extractEntityFromUrl(url);
        return `Exportación de ${exportEntity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
      default:
        // Solo registrar las acciones especificadas
        return `Acción: ${action.description}`;
    }
  } catch (error) {
    return `Acción: ${action.description}`;
  }
}
/**
 * Extraer el nombre de la entidad de la URL
 */
function extractEntityFromUrl(url) {
  // Remover parámetros de query
  const cleanUrl = url.split('?')[0];
  // Extraer el último segmento de la URL
  const segments = cleanUrl.split('/').filter(segment => segment.length > 0);
  if (segments.length === 0) return 'recurso';
  // Mapear URLs a nombres más legibles
  const entityMap = {
    'agency': 'agencia',
    'process': 'proceso',
    'operation-type': 'tipo de operación',
    'costumer-type': 'tipo de cliente',
    'document-type': 'tipo de documento',
    'file-status': 'estado de archivo',
    'user': 'usuario',
    'user-role': 'rol de usuario',
    'user-access': 'acceso de usuario',
    'user-agency': 'agencia de usuario'
  };
  const lastSegment = segments[segments.length - 1];
  return entityMap[lastSegment] || lastSegment;
}
/**
 * Verificar si la URL es de un recurso específico
 */
function isResourceUrl(url) {
  // URLs que representan recursos específicos (no listas)
  const resourcePatterns = [/\/(\d+)$/, /\/[a-f0-9-]{36}$/, /\/[a-zA-Z0-9]{24}$/ // URLs que terminan en ObjectId de MongoDB
  ];

  return resourcePatterns.some(pattern => pattern.test(url));
}
/**
 * Sanitizar datos de request para el log
 */
function sanitizeRequestData(data) {
  if (!data) return null;
  try {
    // Crear una copia profunda del objeto para no modificar el original
    const sanitized = JSON.parse(JSON.stringify(data));
    // Lista de campos sensibles que deben ser removidos
    const sensitiveFields = ['password', 'pass', 'Pass', 'Password', 'confirmPassword', 'confirm_password', 'ConfirmPassword', 'oldPassword', 'old_password', 'OldPassword', 'newPassword', 'new_password', 'NewPassword', 'token', 'Token', 'access_token', 'accessToken', 'AccessToken', 'refresh_token', 'refreshToken', 'RefreshToken', 'secret', 'Secret', 'api_key', 'apiKey', 'ApiKey', 'private_key', 'privateKey', 'PrivateKey', 'authorization', 'Authorization', 'auth', 'Auth', 'session', 'Session', 'cookie', 'Cookie', 'credit_card', 'creditCard', 'CreditCard', 'ssn', 'SSN', 'social_security', 'socialSecurity', 'phone', 'Phone', 'telephone', 'Telephone', 'email', 'Email', 'mail', 'Mail'];
    // Función recursiva para remover campos sensibles
    function removeSensitiveFields(obj) {
      if (obj && typeof obj === 'object') {
        // Manejar arrays
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              removeSensitiveFields(item);
            }
          });
          return;
        }
        // Manejar objetos
        Object.keys(obj).forEach(key => {
          if (sensitiveFields.includes(key)) {
            obj[key] = '[CAMPO SENSIBLE OCULTO]';
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            removeSensitiveFields(obj[key]);
          }
        });
      }
    }
    // Aplicar sanitización
    removeSensitiveFields(sanitized);
    // Limitar el tamaño del JSON para evitar logs muy largos
    const jsonString = JSON.stringify(sanitized, null, 2);
    const maxLength = 2000; // Máximo 2000 caracteres
    if (jsonString.length > maxLength) {
      return jsonString.substring(0, maxLength) + '... [TRUNCADO]';
    }
    return jsonString;
  } catch (error) {
    console.warn('Error al sanitizar datos de request:', error);
    return '[Datos no serializables]';
  }
}
/**
 * Verificar si un campo es sensible
 */
function isSensitiveField(fieldName) {
  const sensitiveFields = ['password', 'pass', 'Pass', 'Password', 'confirmPassword', 'confirm_password', 'ConfirmPassword', 'oldPassword', 'old_password', 'OldPassword', 'newPassword', 'new_password', 'NewPassword', 'token', 'Token', 'access_token', 'accessToken', 'AccessToken', 'refresh_token', 'refreshToken', 'RefreshToken', 'secret', 'Secret', 'api_key', 'apiKey', 'ApiKey', 'private_key', 'privateKey', 'PrivateKey', 'authorization', 'Authorization', 'auth', 'Auth', 'session', 'Session', 'cookie', 'Cookie', 'credit_card', 'creditCard', 'CreditCard', 'ssn', 'SSN', 'social_security', 'socialSecurity', 'phone', 'Phone', 'telephone', 'Telephone', 'email', 'Email', 'mail', 'Mail'];
  return sensitiveFields.some(field => fieldName.toLowerCase().includes(field.toLowerCase()));
}
/**
 * Obtener el tamaño de la respuesta
 */
function getResponseSize(response) {
  try {
    const responseText = JSON.stringify(response.body);
    return new Blob([responseText]).size;
  } catch (error) {
    return 0;
  }
}

/***/ }),

/***/ 44047:
/*!*******************************************************!*\
  !*** ./src/app/core/interceptors/auth.interceptor.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthInterceptor: () => (/* binding */ AuthInterceptor)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 33252);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 81527);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 81891);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 90304);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../environments/environment */ 20553);





const AuthInterceptor = (request, next) => {
  const authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
  // Debug completo de la petición
  console.log('🔍 Interceptor - URL completa:', request.url);
  console.log('🔍 Interceptor - Método:', request.method);
  console.log('🔍 Interceptor - URL incluye localhost:8080:', request.url.includes('localhost:8080'));
  console.log('🔍 Interceptor - URL empieza con /api:', request.url.startsWith('/api'));
  console.log('🔍 Interceptor - URL empieza con http:', request.url.startsWith('http'));
  // Obtener el token de autenticación
  const token = authService.getToken();
  const isAuthenticated = authService.isAuthenticated();
  console.log('🔐 Interceptor - Token disponible:', !!token);
  console.log('🔐 Interceptor - Token valor:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('🔐 Interceptor - Usuario autenticado:', isAuthenticated);
  console.log('🔐 Interceptor - Usuario actual:', authService.getCurrentUser());
  // Solo agregar token a llamadas del backend (usando environment)
  if (request.url.includes(_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiBaseUrl.replace('http://', ''))) {
    console.log('🔗 Llamada a backend:', request.url);
    if (token && isAuthenticated) {
      console.log('🔐 Token encontrado y usuario autenticado, agregando a headers');
      console.log('🔐 Headers antes:', request.headers.keys());
      // Clonar la request y agregar el header de autorización
      const authRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('🔐 Headers después:', authRequest.headers.keys());
      console.log('🔐 Authorization header:', authRequest.headers.get('Authorization'));
      return next(authRequest).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
        if (error.status === 401 && !request.url.includes('/auth/refresh')) {
          // Token expirado, intentar renovar
          console.log('🔄 Token expirado, intentando renovar...');
          return handleTokenRefresh(request, next, authService);
        }
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
      }));
    } else {
      console.log('⚠️  No hay token disponible o usuario no autenticado para la llamada al backend');
      console.log('⚠️  Token:', !!token);
      console.log('⚠️  Autenticado:', isAuthenticated);
      // Si no hay token, redirigir al login o mostrar mensaje
      if (!isAuthenticated) {
        console.log('🚫 Usuario no autenticado, redirigiendo al login...');
        // Aquí podrías redirigir al login si es necesario
      }
      // IMPORTANTE: Siempre procesar la request, incluso sin token
      // El backend se encargará de devolver 401 si es necesario
      return next(request);
    }
  } else if (request.url.startsWith('/api')) {
    console.log('⚠️  Llamada local detectada:', request.url);
    // Para URLs locales que empiezan con /api, no hacer nada especial
    // Estas URLs serán procesadas por el navegador como relativas al puerto actual
    return next(request);
  } else if (request.url.startsWith('http')) {
    console.log('🌐 Llamada a URL externa:', request.url);
    return next(request);
  } else {
    console.log('❓ URL no reconocida:', request.url);
    return next(request);
  }
};
/**
 * Manejar renovación automática del token
 */
function handleTokenRefresh(request, next, authService) {
  // Crear un subject para manejar la renovación del token
  const tokenRefreshed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.BehaviorSubject(false);
  // Intentar renovar el token
  authService.refreshAccessToken().subscribe({
    next: response => {
      if (response.success) {
        console.log('✅ Token renovado exitosamente');
        tokenRefreshed$.next(true);
      } else {
        console.log('❌ Error renovando token:', response.message);
        tokenRefreshed$.next(false);
      }
    },
    error: error => {
      console.log('❌ Error renovando token:', error);
      tokenRefreshed$.next(false);
    }
  });
  // Esperar a que se complete la renovación del token
  return tokenRefreshed$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.filter)(refreshed => refreshed !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(refreshed => {
    if (refreshed) {
      // Token renovado, clonar la request con el nuevo token
      const newToken = authService.getToken();
      if (newToken) {
        console.log('🔄 Reintentando request con nuevo token');
        const newRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json'
          }
        });
        return next(newRequest);
      }
    }
    // Si no se pudo renovar el token, redirigir al login
    console.log('🚫 No se pudo renovar el token, redirigiendo al login');
    // Aquí podrías redirigir al login
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => new Error('Token refresh failed'));
  }));
}

/***/ }),

/***/ 310:
/*!**********************************************!*\
  !*** ./src/app/core/luxon/luxon.provider.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   provideLuxon: () => (/* binding */ provideLuxon)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _luxon_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./luxon.service */ 85199);


function provideLuxon() {
  return [{
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_1__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_luxon_service__WEBPACK_IMPORTED_MODULE_0__.LuxonService),
    multi: true
  }];
}

/***/ }),

/***/ 85199:
/*!*********************************************!*\
  !*** ./src/app/core/luxon/luxon.service.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LuxonService: () => (/* binding */ LuxonService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var luxon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! luxon */ 17765);



class LuxonService {
  constructor(localeId) {
    this.localeId = localeId;
    luxon__WEBPACK_IMPORTED_MODULE_0__.Settings.defaultLocale = this.localeId;
  }
  static #_ = this.ɵfac = function LuxonService_Factory(t) {
    return new (t || LuxonService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.LOCALE_ID));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: LuxonService,
    factory: LuxonService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 78936:
/*!**************************************************************!*\
  !*** ./src/app/core/navigation/navigation-loader.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationLoaderService: () => (/* binding */ NavigationLoaderService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 12235);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 81891);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/auth.service */ 90304);





class NavigationLoaderService {
  get items$() {
    return this.authService.currentUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.switchMap)(user => {
      return this.buildNavigation(user);
    }));
  }
  constructor(layoutService, authService) {
    this.layoutService = layoutService;
    this.authService = authService;
    this._items = new rxjs__WEBPACK_IMPORTED_MODULE_3__.BehaviorSubject([]);
    this.loadNavigation();
  }
  buildNavigation(user) {
    const isConfigUser = this.isConfigUser(user);
    const navigationItems = [{
      type: 'subheading',
      label: 'Dashboards',
      children: [{
        type: 'link',
        label: 'Analytics',
        route: '/',
        icon: 'mat:insights',
        routerLinkActiveOptions: {
          exact: true
        }
      }]
    }, {
      type: 'subheading',
      label: 'Procesos',
      children: [{
        type: 'link',
        label: 'Integración de Expediente',
        route: '/procesos/integracion',
        icon: 'mat:sync'
      }]
    }, {
      type: 'subheading',
      label: 'Mesa de Control',
      children: [{
        type: 'link',
        label: 'Validación',
        route: '/mesa-control/validacion',
        icon: 'mat:verified'
      }]
    }];
    // Solo agregar la sección de configuración si el usuario tiene permisos
    if (isConfigUser) {
      navigationItems.push({
        type: 'subheading',
        label: 'Configuración',
        children: [{
          type: 'link',
          label: 'Configuración de Documentos Requeridos',
          route: '/configuracion/documentos-requeridos',
          icon: 'mat:assignment'
        }, {
          type: 'link',
          label: 'Usuarios',
          route: '/configuracion/usuarios',
          icon: 'mat:people'
        }, {
          type: 'link',
          label: 'Logs de Actividad',
          route: '/configuracion/logs-activity',
          icon: 'mat:history'
        }, {
          type: 'dropdown',
          label: 'Catálogos',
          icon: 'mat:category',
          children: [{
            type: 'link',
            label: 'Agencias',
            route: '/configuracion/catalogos/agencias',
            icon: 'mat:business'
          }, {
            type: 'link',
            label: 'Procesos',
            route: '/configuracion/catalogos/procesos',
            icon: 'mat:assignment'
          }, {
            type: 'link',
            label: 'Tipos de Operación',
            route: '/configuracion/catalogos/tipos-operacion',
            icon: 'mat:swap_horiz'
          }, {
            type: 'link',
            label: 'Tipos de Cliente',
            route: '/configuracion/catalogos/tipos-cliente',
            icon: 'mat:person_outline'
          }, {
            type: 'link',
            label: 'Tipos de Documento',
            route: '/configuracion/catalogos/tipos-documento',
            icon: 'mat:description'
          }, {
            type: 'link',
            label: 'Motivos de Aprobación y Rechazo',
            route: '/configuracion/motivos-rechazo',
            icon: 'mat:block'
          }, {
            type: 'link',
            label: 'Motivos Extraordinarios',
            route: '/configuracion/motivos-extraordinarios',
            icon: 'mat:warning'
          }]
        }]
      });
    } else {
      // Usuario no autorizado para configuración
    }
    // Agregar el resto de la navegación
    // navigationItems.push(
    //   {
    //     type: 'subheading',
    //     label: 'Apps',
    //     children: [
    //       {
    //         type: 'link',
    //         label: 'All-In-One Table',
    //         route: '/apps/aio-table',
    //         icon: 'mat:assignment'
    //       },
    //       {
    //         type: 'dropdown',
    //         label: 'Help Center',
    //         icon: 'mat:contact_support',
    //         children: [
    //           {
    //             type: 'link',
    //             label: 'Getting Started',
    //             route: '/apps/help-center/getting-started'
    //           },
    //           {
    //             type: 'link',
    //             label: 'Pricing & Plans',
    //             route: '/apps/help-center/pricing'
    //           },
    //           {
    //             type: 'link',
    //             label: 'FAQ',
    //             route: '/apps/help-center/faq'
    //           },
    //           {
    //             type: 'link',
    //             label: 'Guides',
    //             route: '/apps/help-center/guides'
    //           }
    //         ]
    //       },
    //       {
    //         type: 'link',
    //         label: 'Calendar',
    //         route: '/apps/calendar',
    //         icon: 'mat:date_range',
    //         badge: {
    //           value: '12',
    //           bgClass: 'bg-purple-600',
    //           textClass: 'text-white'
    //         }
    //       },
    //       {
    //         type: 'link',
    //         label: 'Chat',
    //         route: '/apps/chat',
    //         icon: 'mat:chat',
    //         badge: {
    //           value: '16',
    //           bgClass: 'bg-cyan-600',
    //           textClass: 'text-white'
    //         }
    //       },
    //       {
    //         type: 'link',
    //         label: 'Mailbox',
    //         route: '/apps/mail',
    //         icon: 'mat:mail',
    //         badge: {
    //           value: '27',
    //           bgClass: 'bg-amber-600',
    //           textClass: 'text-white'
    //         }
    //       },
    //       {
    //         type: 'link',
    //         label: 'Social',
    //         route: '/apps/social',
    //         icon: 'mat:share'
    //         },
    //       {
    //         type: 'link',
    //         label: 'Contacts',
    //         route: '/apps/contacts/grid',
    //         icon: 'mat:contacts'
    //       },
    //       {
    //         type: 'link',
    //         label: 'Scrumboard',
    //         route: '/apps/scrumboard/1',
    //         icon: 'mat:assessment'
    //       }
    //     ]
    //   }
    // );
    return new rxjs__WEBPACK_IMPORTED_MODULE_4__.Observable(observer => {
      observer.next(navigationItems);
      observer.complete();
    });
  }
  loadNavigation() {
    // La navegación ahora se construye dinámicamente en items$
  }
  isConfigUser(user) {
    // Convertir a number para comparación segura
    const roleId = Number(user?.role_id);
    const is6 = roleId === 6;
    const is7 = roleId === 7;
    const resultado = user && (is6 || is7);
    return resultado;
  }
  static #_ = this.ɵfac = function NavigationLoaderService_Factory(t) {
    return new (t || NavigationLoaderService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_0__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: NavigationLoaderService,
    factory: NavigationLoaderService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 72528:
/*!********************************************************!*\
  !*** ./src/app/core/navigation/navigation.provider.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   provideNavigation: () => (/* binding */ provideNavigation)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _navigation_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navigation.service */ 20120);
/* harmony import */ var _navigation_loader_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navigation-loader.service */ 78936);



function provideNavigation() {
  return [{
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_navigation_service__WEBPACK_IMPORTED_MODULE_0__.NavigationService),
    multi: true
  }, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ENVIRONMENT_INITIALIZER,
    useValue: () => (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_navigation_loader_service__WEBPACK_IMPORTED_MODULE_1__.NavigationLoaderService),
    multi: true
  }];
}

/***/ }),

/***/ 20120:
/*!*******************************************************!*\
  !*** ./src/app/core/navigation/navigation.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationService: () => (/* binding */ NavigationService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _navigation_loader_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navigation-loader.service */ 78936);



class NavigationService {
  constructor(navigationLoaderService) {
    this.navigationLoaderService = navigationLoaderService;
    this.items$ = this.navigationLoaderService.items$;
    this._openChangeSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.openChange$ = this._openChangeSubject.asObservable();
  }
  triggerOpenChange(item) {
    this._openChangeSubject.next(item);
  }
  isLink(item) {
    return item.type === 'link';
  }
  isDropdown(item) {
    return item.type === 'dropdown';
  }
  isSubheading(item) {
    return item.type === 'subheading';
  }
  static #_ = this.ɵfac = function NavigationService_Factory(t) {
    return new (t || NavigationService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_navigation_loader_service__WEBPACK_IMPORTED_MODULE_0__.NavigationLoaderService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: NavigationService,
    factory: NavigationService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 41882:
/*!*******************************************************!*\
  !*** ./src/app/core/services/activity-log.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActivityLogService: () => (/* binding */ ActivityLogService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);



class ActivityLogService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
  }
  /**
   * Crear un nuevo log de actividad
   */
  createLog(log) {
    const url = this.apiBaseService.buildApiUrl('user-activity-logs');
    return this.http.post(url, log);
  }
  /**
   * Obtener todos los logs con filtros
   */
  getLogs(filters = {}) {
    const url = this.apiBaseService.buildApiUrl('user-activity-logs');
    const params = this.buildQueryParams(filters);
    return this.http.get(`${url}?${params}`);
  }
  /**
   * Obtener logs de un usuario específico
   */
  getUserLogs(userId, limit = 100, offset = 0) {
    const url = this.apiBaseService.buildApiUrl(`user-activity-logs/user/${userId}`);
    const params = `limit=${limit}&offset=${offset}`;
    return this.http.get(`${url}?${params}`);
  }
  /**
   * Obtener logs por acción específica
   */
  getActionLogs(action, limit = 100, offset = 0) {
    const url = this.apiBaseService.buildApiUrl(`user-activity-logs/action/${action}`);
    const params = `limit=${limit}&offset=${offset}`;
    return this.http.get(`${url}?${params}`);
  }
  /**
   * Obtener estadísticas de logs
   */
  getStats(userId, startDate, endDate) {
    const url = this.apiBaseService.buildApiUrl('user-activity-logs/stats');
    let params = '';
    if (userId) params += `user_id=${userId}`;
    if (startDate) params += `${params ? '&' : ''}start_date=${startDate}`;
    if (endDate) params += `${params ? '&' : ''}end_date=${endDate}`;
    const fullUrl = params ? `${url}?${params}` : url;
    return this.http.get(fullUrl);
  }
  /**
   * Limpiar logs antiguos
   */
  cleanOldLogs(days = 90) {
    const url = this.apiBaseService.buildApiUrl(`user-activity-logs/clean?days=${days}`);
    return this.http.delete(url);
  }
  /**
   * Log automático de acciones del usuario
   */
  logUserAction(action, description, additionalData) {
    // Obtener información del usuario actual desde localStorage
    const currentUserStr = localStorage.getItem('current_user');
    if (!currentUserStr) return;
    try {
      const currentUser = JSON.parse(currentUserStr);
      const log = {
        user_id: currentUser.id || 'unknown',
        username: currentUser.username || currentUser.name || 'unknown',
        action: action,
        description: description,
        change_details: additionalData?.change_details || undefined
      };
      // Enviar log de forma asíncrona (no bloquear la UI)
      this.createLog(log).subscribe({
        next: () => console.log('Activity log created:', action),
        error: error => console.error('Error creating activity log:', error)
      });
    } catch (error) {
      console.error('Error parsing current user for activity log:', error);
    }
  }
  /**
   * Log de navegación
   */
  logNavigation(url, method = 'GET') {
    this.logUserAction('NAVIGATION', `Navegó a ${url}`, {
      url,
      method
    });
  }
  /**
   * Log de login
   */
  logLogin(username) {
    this.logUserAction('LOGIN', `Usuario ${username} inició sesión`, {
      username
    });
  }
  /**
   * Log de logout
   */
  logLogout(username) {
    this.logUserAction('LOGOUT', `Usuario ${username} cerró sesión`, {
      username
    });
  }
  /**
   * Log de creación de registro
   */
  logCreate(entity, entityId, data) {
    this.logUserAction('CREATE', `Creó ${entity} con ID ${entityId}`, {
      entity,
      entityId,
      data
    });
  }
  /**
   * Log de actualización de registro
   */
  logUpdate(entity, entityId, data) {
    this.logUserAction('UPDATE', `Actualizó ${entity} con ID ${entityId}`, {
      entity,
      entityId,
      data
    });
  }
  /**
   * Log de eliminación de registro
   */
  logDelete(entity, entityId) {
    this.logUserAction('DELETE', `Eliminó ${entity} con ID ${entityId}`, {
      entity,
      entityId
    });
  }
  /**
   * Log de búsqueda
   */
  logSearch(entity, query, results) {
    this.logUserAction('SEARCH', `Buscó en ${entity}: "${query}" (${results} resultados)`, {
      entity,
      query,
      results
    });
  }
  /**
   * Log de exportación
   */
  logExport(entity, format, records) {
    this.logUserAction('EXPORT', `Exportó ${records} registros de ${entity} en formato ${format}`, {
      entity,
      format,
      records
    });
  }
  /**
   * Construir parámetros de consulta
   */
  buildQueryParams(filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return params.toString();
  }
  static #_ = this.ɵfac = function ActivityLogService_Factory(t) {
    return new (t || ActivityLogService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: ActivityLogService,
    factory: ActivityLogService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 14461:
/*!***************************************************!*\
  !*** ./src/app/core/services/api-base.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApiBaseService: () => (/* binding */ ApiBaseService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);


class ApiBaseService {
  constructor() {}
  /**
   * Obtiene la URL base de la API
   */
  getApiBaseUrl() {
    const baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl;
    console.log('🔍 ApiBaseService - getApiBaseUrl llamado:', baseUrl);
    console.log('🔍 ApiBaseService - Environment completo:', _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment);
    if (!baseUrl || !baseUrl.startsWith('http')) {
      console.error('❌ ERROR: Environment apiBaseUrl no es válido:', baseUrl);
      throw new Error(`Environment apiBaseUrl no es válido: ${baseUrl}`);
    }
    return baseUrl;
  }
  /**
   * Construye la URL completa para un endpoint específico
   * @param endpoint - El endpoint de la API (ej: 'agency', 'user')
   * @returns URL completa
   */
  buildApiUrl(endpoint) {
    // Asegurar que el endpoint comience con /
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    // Construir URL absoluta completa
    const fullUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl + '/api' + endpoint;
    // Debug: verificar que la URL sea absoluta
    console.log(`🔗 Construyendo URL: ${endpoint} -> ${fullUrl}`);
    console.log(`🔍 URL es absoluta: ${fullUrl.startsWith('http')}`);
    console.log(`🔍 Environment: ${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}`);
    // Forzar URL absoluta - verificar que no haya problemas de construcción
    if (!fullUrl.startsWith('http')) {
      console.error('❌ ERROR: URL no es absoluta:', fullUrl);
      throw new Error(`URL construida no es absoluta: ${fullUrl}`);
    }
    return fullUrl;
  }
  /**
   * Construye la URL para endpoints de autenticación
   * @param endpoint - El endpoint de autenticación
   * @returns URL completa
   */
  buildAuthUrl(endpoint) {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    return _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl + '/api/auth' + endpoint;
  }
  /**
   * Construye la URL para endpoints de WebSocket
   * @param endpoint - El endpoint de WebSocket
   * @returns URL completa
   */
  buildWsUrl(endpoint) {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    return _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl.replace('http', 'ws') + endpoint;
  }
  static #_ = this.ɵfac = function ApiBaseService_Factory(t) {
    return new (t || ApiBaseService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: ApiBaseService,
    factory: ApiBaseService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 90304:
/*!***********************************************!*\
  !*** ./src/app/core/services/auth.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 33252);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 13738);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 81891);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _activity_log_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./activity-log.service */ 41882);







class AuthService {
  constructor(http, apiBaseService, router, activityLogService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.router = router;
    this.activityLogService = activityLogService;
    this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
    this.accessTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
    this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
    this.tokenExpirationSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.accessToken$ = this.accessTokenSubject.asObservable();
    this.refreshToken$ = this.refreshTokenSubject.asObservable();
    this.tokenExpiration$ = this.tokenExpirationSubject.asObservable();
    this.isRefreshing = false;
    this.refreshTokenSubject$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
    this.loadStoredAuth();
  }
  /**
   * Cargar autenticación almacenada
   */
  loadStoredAuth() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('current_user');
    const expirationStr = localStorage.getItem('token_expiration');
    if (accessToken && refreshToken && userStr && expirationStr) {
      const user = JSON.parse(userStr);
      const expiration = parseInt(expirationStr);
      // Verificar si el token no ha expirado
      if (Date.now() < expiration) {
        this.accessTokenSubject.next(accessToken);
        this.refreshTokenSubject.next(refreshToken);
        this.currentUserSubject.next(user);
        this.tokenExpirationSubject.next(expiration);
      } else {
        // Token expirado, intentar renovar
        this.refreshAccessToken();
      }
    }
  }
  /**
   * Login de usuario
   */
  login(email, password) {
    const url = this.apiBaseService.buildAuthUrl('/login');
    return this.http.post(url, {
      email,
      password
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(response => {
      if (response.success) {
        this.setAuthData(response);
        // Log de login exitoso
        this.activityLogService.logLogin(response.user.username || response.user.email);
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error en login:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  /**
   * Renovar access token
   */
  refreshAccessToken() {
    if (this.isRefreshing) {
      // Si ya se está renovando, esperar
      return this.refreshTokenSubject$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.switchMap)(token => {
        if (token) {
          return this.http.post(this.apiBaseService.buildAuthUrl('/refresh'), {
            refresh_token: token
          });
        } else {
          return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => new Error('No refresh token available'));
        }
      }));
    }
    this.isRefreshing = true;
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.isRefreshing = false;
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => new Error('No refresh token available'));
    }
    return this.http.post(this.apiBaseService.buildAuthUrl('/refresh'), {
      refresh_token: refreshToken
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(response => {
      if (response.success) {
        this.updateAccessToken(response.access_token, response.expires_in);
      }
      this.isRefreshing = false;
      this.refreshTokenSubject$.next(response.success ? response.access_token : null);
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      this.isRefreshing = false;
      this.refreshTokenSubject$.next(null);
      this.logout(); // Si falla el refresh, hacer logout
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  /**
   * Logout de usuario
   */
  logout() {
    console.log('AuthService: Iniciando logout...');
    const url = this.apiBaseService.buildAuthUrl('/logout');
    console.log('AuthService: URL de logout:', url);
    return this.http.post(url, {}).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(() => {
      console.log('AuthService: Logout exitoso en backend');
      // Log de logout antes de limpiar datos
      const currentUser = this.currentUserSubject.value;
      if (currentUser) {
        this.activityLogService.logLogout(currentUser.username || currentUser.email);
      }
      this.clearAuthData();
      console.log('AuthService: Datos limpiados, redirigiendo a login...');
      this.router.navigate(['/login']);
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('AuthService: Error en logout del backend:', error);
      // Aunque falle el logout en el backend, limpiar datos locales
      this.clearAuthData();
      console.log('AuthService: Datos limpiados por error, redirigiendo a login...');
      this.router.navigate(['/login']);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }));
  }
  /**
   * Establecer datos de autenticación
   */
  setAuthData(response) {
    const expiration = Date.now() + response.expires_in * 1000;
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    localStorage.setItem('token_expiration', expiration.toString());
    this.accessTokenSubject.next(response.access_token);
    this.refreshTokenSubject.next(response.refresh_token);
    this.currentUserSubject.next(response.user);
    this.tokenExpirationSubject.next(expiration);
  }
  /**
   * Actualizar access token
   */
  updateAccessToken(accessToken, expiresIn) {
    const expiration = Date.now() + expiresIn * 1000;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('token_expiration', expiration.toString());
    this.accessTokenSubject.next(accessToken);
    this.tokenExpirationSubject.next(expiration);
  }
  /**
   * Limpiar datos de autenticación
   */
  clearAuthData() {
    console.log('AuthService: Limpiando datos de autenticación...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('token_expiration');
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.tokenExpirationSubject.next(null);
    console.log('AuthService: Datos de autenticación limpiados');
  }
  /**
   * Obtener access token actual
   */
  getToken() {
    return this.accessTokenSubject.value;
  }
  /**
   * Obtener refresh token actual
   */
  getRefreshToken() {
    return this.refreshTokenSubject.value;
  }
  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    const token = this.getToken();
    const expiration = this.tokenExpirationSubject.value;
    if (!token || !expiration) {
      return false;
    }
    // Verificar si el token expira en los próximos 5 minutos
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    if (expiration < fiveMinutesFromNow) {
      // Token expira pronto, renovar automáticamente
      this.refreshAccessToken().subscribe();
    }
    return true;
  }
  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  /**
   * Verificar si el usuario es administrador
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user ? user.role_id === '7' : false;
  }
  /**
   * Verificar si el token necesita renovación
   */
  needsTokenRefresh() {
    const expiration = this.tokenExpirationSubject.value;
    if (!expiration) return true;
    // Renovar si expira en los próximos 5 minutos
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return expiration < fiveMinutesFromNow;
  }
  static #_ = this.ɵfac = function AuthService_Factory(t) {
    return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_9__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_activity_log_service__WEBPACK_IMPORTED_MODULE_1__.ActivityLogService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
    token: AuthService,
    factory: AuthService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 48158:
/*!**************************************************************!*\
  !*** ./src/app/layouts/base-layout/base-layout.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseLayoutComponent: () => (/* binding */ BaseLayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/sidenav */ 31465);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 58989);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 33839);
/* harmony import */ var _vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/utils/check-router-childs-data */ 39681);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _vex_utils_is_nil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/utils/is-nil */ 75832);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 60839);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/config/vex-config.service */ 50376);













function BaseLayoutComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵprojection"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const config_r1 = ctx.ngIf;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("vex-layout-boxed", config_r1.boxed)("vex-layout-footer-enabled", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 18, ctx_r0.isFooterVisible$))("vex-layout-footer-fixed", config_r1.footer.fixed && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 20, ctx_r0.isFooterVisible$))("vex-layout-horizontal", config_r1.layout === "horizontal")("vex-layout-scroll-disabled", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 22, ctx_r0.scrollDisabled$))("vex-layout-search-overlay-open", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 24, ctx_r0.searchOpen$))("vex-layout-sidenav-collapsed", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 26, ctx_r0.sidenavCollapsed$))("vex-layout-toolbar-fixed", config_r1.toolbar.fixed)("vex-layout-vertical", config_r1.layout === "vertical");
  }
}
const _c0 = ["*"];
class BaseLayoutComponent {
  constructor(layoutService, configService, router, document) {
    this.layoutService = layoutService;
    this.configService = configService;
    this.router = router;
    this.document = document;
    this.config$ = this.configService.config$;
    /**
     * Check if footer should be visible
     */
    this.isFooterVisible$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.combineLatest)([
    /**
     * Check if footer is enabled in the config
     */
    this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.map)(config => config.footer.visible)),
    /**
     * Check if footer is enabled on the current route
     */
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_8__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.map)(() => (0,_vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_0__.checkRouterChildsData)(this.router.routerState.root.snapshot, data => data.footerVisible ?? true)))]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.map)(([configEnabled, routeEnabled]) => {
      if ((0,_vex_utils_is_nil__WEBPACK_IMPORTED_MODULE_1__.isNil)(routeEnabled)) {
        return configEnabled;
      }
      return configEnabled && routeEnabled;
    }));
    this.sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
    this.isDesktop$ = this.layoutService.isDesktop$;
    this.scrollDisabled$ = this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_8__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.map)(() => (0,_vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_0__.checkRouterChildsData)(this.router.routerState.root.snapshot, data => data.scrollDisabled ?? false)));
    this.searchOpen$ = this.layoutService.searchOpen$;
    this.destroyRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_4__.DestroyRef);
  }
  ngOnInit() {
    /**
     * Open sidenav on desktop when layout is not vertical
     * Close sidenav on mobile or when layout is vertical
     */
    (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.combineLatest)([this.isDesktop$, this.configService.select(config => config.layout === 'vertical')]).pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__.takeUntilDestroyed)(this.destroyRef)).subscribe(([isDesktop, isVerticalLayout]) => {
      if (isDesktop && !isVerticalLayout) {
        this.layoutService.openSidenav();
      } else {
        this.layoutService.closeSidenav();
      }
    });
    /**
     * Mobile only:
     * Close Sidenav after Navigating somewhere (e.g. when a user clicks a link in the Sidenav)
     */
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_8__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.withLatestFrom)(this.isDesktop$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(([event, matches]) => !matches), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__.takeUntilDestroyed)(this.destroyRef)).subscribe(() => this.layoutService.closeSidenav());
  }
  ngAfterViewInit() {
    /**
     * Enable Scrolling to specific parts of the page using the Router
     */
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(e => e instanceof _angular_router__WEBPACK_IMPORTED_MODULE_8__.Scroll), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_10__.takeUntilDestroyed)(this.destroyRef)).subscribe(e => {
      if (e.position) {
        // backward navigation
        this.sidenavContainer.scrollable.scrollTo({
          start: e.position[0],
          top: e.position[1]
        });
      } else if (e.anchor) {
        // anchor navigation
        const scroll = anchor => this.sidenavContainer.scrollable.scrollTo({
          behavior: 'smooth',
          top: anchor.offsetTop,
          left: anchor.offsetLeft
        });
        let anchorElem = this.document.getElementById(e.anchor);
        if (anchorElem) {
          scroll(anchorElem);
        } else {
          setTimeout(() => {
            if (!e.anchor) {
              return;
            }
            anchorElem = this.document.getElementById(e.anchor);
            if (!anchorElem) {
              return;
            }
            scroll(anchorElem);
          }, 100);
        }
      } else {
        // forward navigation
        this.sidenavContainer.scrollable.scrollTo({
          top: 0,
          start: 0
        });
      }
    });
  }
  static #_ = this.ɵfac = function BaseLayoutComponent_Factory(t) {
    return new (t || BaseLayoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_2__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_3__.VexConfigService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_12__.DOCUMENT));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: BaseLayoutComponent,
    selectors: [["vex-base-layout"]],
    contentQueries: function BaseLayoutComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵcontentQuery"](dirIndex, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__.MatSidenavContainer, 7);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵloadQuery"]()) && (ctx.sidenavContainer = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 3,
    consts: [["class", "vex-base-layout-container", 3, "vex-layout-boxed", "vex-layout-footer-enabled", "vex-layout-footer-fixed", "vex-layout-horizontal", "vex-layout-scroll-disabled", "vex-layout-search-overlay-open", "vex-layout-sidenav-collapsed", "vex-layout-toolbar-fixed", "vex-layout-vertical", 4, "ngIf"], [1, "vex-base-layout-container"]],
    template: function BaseLayoutComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, BaseLayoutComponent_div_0_Template, 7, 28, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "async");
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 1, ctx.config$));
      }
    },
    dependencies: [_angular_material_sidenav__WEBPACK_IMPORTED_MODULE_13__.MatSidenavModule, _angular_common__WEBPACK_IMPORTED_MODULE_12__.AsyncPipe, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 93147:
/*!***************************************************************!*\
  !*** ./src/app/layouts/components/footer/footer.component.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterComponent: () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);



class FooterComponent {
  constructor() {}
  ngOnInit() {}
  ngOnDestroy() {}
  static #_ = this.ɵfac = function FooterComponent_Factory(t) {
    return new (t || FooterComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: FooterComponent,
    selectors: [["vex-footer"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 6,
    vars: 0,
    consts: [[1, "flex-auto", "flex", "items-center", "container"], [1, "font-medium", "ltr:ml-4", "rtl:mr-4", "hidden", "sm:block", "flex", "items-center"], ["href", "https://nexusqtech.com", "target", "_blank", 1, "flex", "items-center", "hover:opacity-80", "transition-opacity"], ["src", "assets/img/icons/logos/nexusQtech.svg", "alt", "Grupo Vanguardia", 1, "h-6", "w-auto", "mr-2"]],
    template: function FooterComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Powered by Grupo Vanguardia - Innovaci\u00F3n tecnol\u00F3gica para tu negocio.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_1__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__.MatIconModule],
    styles: ["[_nghost-%COMP%] {\n  position: relative;\n  bottom: 0px;\n  display: flex;\n  width: 100%;\n  border-top-width: 1px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-background-card-rgb) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-text-rgb) / var(--tw-text-opacity));\n}:is(.dark   )[_nghost-%COMP%] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-background-background-rgb) / var(--tw-bg-opacity));\n}[_nghost-%COMP%] {\n  height: var(--vex-footer-height);\n  z-index: var(--vex-footer-z-index);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFBQSxrQkFBQTtFQUFBLFdBQUE7RUFBQSxhQUFBO0VBQUEsV0FBQTtFQUFBLHFCQUFBO0VBQUEsa0JBQUE7RUFBQSw0RUFBQTtFQUFBLG9CQUFBO0VBQUE7QUFBQSxDQUFBO0VBQUEsa0JBQUE7RUFBQTtBQUFBLENBREY7RUFFRSxnQ0FBQTtFQUNBLGtDQUFBO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIEBhcHBseSBiZy1mb3JlZ3JvdW5kIGRhcms6YmctYmFzZSBib3JkZXItdCB0ZXh0LWRlZmF1bHQgZmxleCB3LWZ1bGwgYm90dG9tLTAgcmVsYXRpdmU7XG4gIGhlaWdodDogdmFyKC0tdmV4LWZvb3Rlci1oZWlnaHQpO1xuICB6LWluZGV4OiB2YXIoLS12ZXgtZm9vdGVyLXotaW5kZXgpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 9208:
/*!********************************************************************************************!*\
  !*** ./src/app/layouts/components/navigation/navigation-item/navigation-item.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationItemComponent: () => (/* binding */ NavigationItemComponent)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/utils/track-by */ 47637);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/navigation/navigation.service */ 20120);













const _c0 = (a0, a1) => ({
  "bg-primary-600 text-on-primary-600": a0,
  "navigation-color": a1
});
function NavigationItemComponent_a_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    let tmp_0_0;
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("hover:bg-hover", !((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 5, ctx_r0.isActive$)) == null ? null : tmp_0_0(ctx_r0.item)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](11, _c0, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 7, ctx_r0.isActive$)) == null ? null : tmp_1_0(ctx_r0.item), !((tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 9, ctx_r0.isActive$)) == null ? null : tmp_1_0(ctx_r0.item))))("routerLink", ctx_r0.item.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.item.label, "\n");
  }
}
function NavigationItemComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function NavigationItemComponent_div_1_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r3.item.route());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("hover:bg-hover", !((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 3, ctx_r1.isActive$)) == null ? null : tmp_0_0(ctx_r1.item)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r1.item.label, "\n");
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_a_1_mat_icon_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-icon", 14);
  }
  if (rf & 2) {
    const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("svgIcon", child_r9.icon);
  }
}
const _c1 = a0 => ({
  "text-primary-600": a0
});
function NavigationItemComponent_ng_container_2_ng_container_8_a_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, NavigationItemComponent_ng_container_2_ng_container_8_a_1_mat_icon_2_Template, 1, 1, "mat-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c1, (tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 4, ctx_r10.isActive$)) == null ? null : tmp_0_0(child_r9)))("routerLink", child_r9.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", child_r9.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](child_r9.label);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_div_2_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-icon", 14);
  }
  if (rf & 2) {
    const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("svgIcon", child_r9.icon);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function NavigationItemComponent_ng_container_2_ng_container_8_div_2_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](child_r9.route());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, NavigationItemComponent_ng_container_2_ng_container_8_div_2_mat_icon_1_Template, 1, 1, "mat-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", child_r9.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](child_r9.label);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_mat_icon_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-icon", 14);
  }
  if (rf & 2) {
    const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("svgIcon", child_r9.icon);
  }
}
const _c2 = a0 => ({
  item: a0
});
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](1, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r42 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](11);
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](2, _c2, item_r42))("ngTemplateOutlet", _r8);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mat-menu", 6, 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_Template, 2, 4, "ng-container", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r40 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
    const child_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](10);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matMenuTriggerFor", _r40)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c1, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 4, ctx_r39.isActive$)) == null ? null : tmp_1_0(child_r38)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", child_r38.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", child_r38.children);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](1, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_Template, 7, 8, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const child_r38 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](9);
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](10);
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](3, _c2, child_r38))("ngTemplateOutlet", _r8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r37.isDropdown(child_r38));
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mat-menu", 6, 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_ng_container_6_Template, 3, 5, "ng-container", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
    const item_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](8);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matMenuTriggerFor", _r36)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c1, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 4, ctx_r35.isActive$)) == null ? null : tmp_1_0(item_r34)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", item_r34.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", item_r34.children);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](1, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_ng_container_2_Template, 7, 8, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r34 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](7);
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](10);
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](3, _c2, item_r34))("ngTemplateOutlet", _r8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r33.isDropdown(item_r34));
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mat-menu", 6, 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_ng_container_6_Template, 3, 5, "ng-container", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
    const child_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](6);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matMenuTriggerFor", _r32)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c1, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 4, ctx_r31.isActive$)) == null ? null : tmp_1_0(child_r30)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", child_r30.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", child_r30.children);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](1, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_ng_container_2_Template, 7, 8, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const child_r30 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](5);
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](10);
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](3, _c2, child_r30))("ngTemplateOutlet", _r8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r29.isDropdown(child_r30));
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mat-menu", 6, 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_ng_container_6_Template, 3, 5, "ng-container", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
    const item_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](4);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matMenuTriggerFor", _r28)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c1, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 4, ctx_r27.isActive$)) == null ? null : tmp_1_0(item_r26)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", item_r26.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", item_r26.children);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](1, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_ng_container_2_Template, 7, 8, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](10);
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](3, _c2, item_r26))("ngTemplateOutlet", _r8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r24.isDropdown(item_r26));
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_mat_icon_3_Template, 1, 1, "mat-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "mat-menu", 6, 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_ng_container_8_Template, 3, 5, "ng-container", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](7);
    const child_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matMenuTriggerFor", _r23)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](7, _c1, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 5, ctx_r12.isActive$)) == null ? null : tmp_1_0(child_r9)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", child_r9.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](child_r9.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", child_r9.children);
  }
}
function NavigationItemComponent_ng_container_2_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, NavigationItemComponent_ng_container_2_ng_container_8_a_1_Template, 5, 8, "a", 10)(2, NavigationItemComponent_ng_container_2_ng_container_8_div_2_Template, 4, 2, "div", 11)(3, NavigationItemComponent_ng_container_2_ng_container_8_ng_container_3_Template, 9, 9, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const child_r9 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r6.isLink(child_r9) && !ctx_r6.isFunction(child_r9.route));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r6.isLink(child_r9) && ctx_r6.isFunction(child_r9.route));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r6.isDropdown(child_r9));
  }
}
function NavigationItemComponent_ng_container_2_ng_template_9_a_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().item;
    const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](5, _c1, (tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 3, ctx_r49.isActive$)) == null ? null : tmp_0_0(item_r48)))("routerLink", item_r48.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](item_r48.label);
  }
}
function NavigationItemComponent_ng_container_2_ng_template_9_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r54 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function NavigationItemComponent_ng_container_2_ng_template_9_div_1_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r54);
      const item_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().item;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](item_r48.route());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().item;
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](4, _c1, (tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 2, ctx_r50.isActive$)) == null ? null : tmp_0_0(item_r48)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", item_r48.label, " ");
  }
}
function NavigationItemComponent_ng_container_2_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, NavigationItemComponent_ng_container_2_ng_template_9_a_0_Template, 3, 7, "a", 10)(1, NavigationItemComponent_ng_container_2_ng_template_9_div_1_Template, 3, 6, "div", 23);
  }
  if (rf & 2) {
    const item_r48 = ctx.item;
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r7.isLink(item_r48) && !ctx_r7.isFunction(item_r48.route));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r7.isLink(item_r48) && ctx_r7.isFunction(item_r48.route));
  }
}
function NavigationItemComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "mat-menu", 6, 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, NavigationItemComponent_ng_container_2_ng_container_8_Template, 4, 3, "ng-container", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, NavigationItemComponent_ng_container_2_ng_template_9_Template, 2, 2, "ng-template", null, 9, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](7);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    let tmp_0_0;
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("hover:bg-hover", !((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 6, ctx_r2.isActive$)) == null ? null : tmp_0_0(ctx_r2.item)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matMenuTriggerFor", _r5)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](12, _c0, (tmp_2_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 8, ctx_r2.isActive$)) == null ? null : tmp_2_0(ctx_r2.item), !((tmp_2_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](4, 10, ctx_r2.isActive$)) == null ? null : tmp_2_0(ctx_r2.item))));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r2.item.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r2.item.children);
  }
}
class NavigationItemComponent {
  constructor(navigationService, router) {
    this.navigationService = navigationService;
    this.router = router;
    this.isActive$ = this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_4__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.map)(() => item => this.hasActiveChilds(item)));
    this.isLink = this.navigationService.isLink;
    this.isDropdown = this.navigationService.isDropdown;
    this.isSubheading = this.navigationService.isSubheading;
    this.trackByRoute = _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_0__.trackByRoute;
  }
  ngOnInit() {}
  hasActiveChilds(parent) {
    if (this.isLink(parent)) {
      return this.router.isActive(parent.route, true);
    }
    if (this.isDropdown(parent) || this.isSubheading(parent)) {
      return parent.children.some(child => {
        if (this.isDropdown(child)) {
          return this.hasActiveChilds(child);
        }
        if (this.isLink(child) && !this.isFunction(child.route)) {
          return this.router.isActive(child.route, true);
        }
        return false;
      });
    }
    return false;
  }
  isFunction(prop) {
    return prop instanceof Function;
  }
  static #_ = this.ɵfac = function NavigationItemComponent_Factory(t) {
    return new (t || NavigationItemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_1__.NavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: NavigationItemComponent,
    selectors: [["vex-navigation-item"]],
    inputs: {
      item: "item"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 3,
    vars: 3,
    consts: [["class", "navigation-item", "matRipple", "", 3, "hover:bg-hover", "ngClass", "routerLink", 4, "ngIf"], ["class", "navigation-item navigation-color", "matRipple", "", 3, "hover:bg-hover", "click", 4, "ngIf"], [4, "ngIf"], ["matRipple", "", 1, "navigation-item", 3, "ngClass", "routerLink"], ["matRipple", "", 1, "navigation-item", "navigation-color", 3, "click"], ["matRipple", "", 1, "navigation-item", 3, "matMenuTriggerFor", "ngClass"], ["yPosition", "below"], ["menu", "matMenu"], [4, "ngFor", "ngForOf"], ["linkTemplate", ""], ["class", "navigation-menu-item", "mat-menu-item", "", 3, "ngClass", "routerLink", 4, "ngIf"], ["class", "navigation-menu-item", "mat-menu-item", "", 3, "click", 4, "ngIf"], ["mat-menu-item", "", 1, "navigation-menu-item", 3, "ngClass", "routerLink"], ["class", "text-current", 3, "svgIcon", 4, "ngIf"], [1, "text-current", 3, "svgIcon"], ["mat-menu-item", "", 1, "navigation-menu-item", 3, "click"], ["mat-menu-item", "", 1, "navigation-menu-item", 3, "matMenuTriggerFor", "ngClass"], ["level1", "matMenu"], [3, "ngTemplateOutletContext", "ngTemplateOutlet"], ["level2", "matMenu"], ["level3", "matMenu"], ["level4", "matMenu"], ["level5", "matMenu"], ["class", "navigation-menu-item", "mat-menu-item", "", 3, "ngClass", "click", 4, "ngIf"], ["mat-menu-item", "", 1, "navigation-menu-item", 3, "ngClass", "click"]],
    template: function NavigationItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, NavigationItemComponent_a_0_Template, 5, 14, "a", 0)(1, NavigationItemComponent_div_1_Template, 3, 5, "div", 1)(2, NavigationItemComponent_ng_container_2_Template, 11, 15, "ng-container", 2);
      }
      if (rf & 2) {
        let tmp_2_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLink(ctx.item) && !ctx.isFunction(ctx.item.route));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLink(ctx.item) && ctx.isFunction(ctx.item.route));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isSubheading(ctx.item) && ((tmp_2_0 = ctx.item.children == null ? null : ctx.item.children.length) !== null && tmp_2_0 !== undefined ? tmp_2_0 : 0) > 0 || ctx.isDropdown(ctx.item));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatRipple, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgClass, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_material_menu__WEBPACK_IMPORTED_MODULE_9__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_9__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_9__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_9__.MatMenuTrigger, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgFor, _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_7__.AsyncPipe],
    styles: [".navigation-item[_ngcontent-%COMP%] {\n  position: relative;\n  margin-inline-end: 0.5rem;\n  display: block;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--vex-border-radius);\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  text-decoration-line: none;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n\n.navigation-color[_ngcontent-%COMP%] {\n  color: var(--vex-navigation-color);\n}\n\n.navigation-menu-item[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.navigation-menu-item[_ngcontent-%COMP%]:hover {\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-color-primary-600) / var(--tw-text-opacity));\n}\n.navigation-menu-item[_ngcontent-%COMP%]:hover   .mat-icon[_ngcontent-%COMP%] {\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-color-primary-600) / var(--tw-text-opacity));\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi1pdGVtL25hdmlnYXRpb24taXRlbS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTtFQUFBLGtCQUFBO0VBQUEseUJBQUE7RUFBQSxjQUFBO0VBQUEsZUFBQTtFQUFBLHlCQUFBO1VBQUEsaUJBQUE7RUFBQSx1Q0FBQTtFQUFBLGtCQUFBO0VBQUEsbUJBQUE7RUFBQSxtQkFBQTtFQUFBLHNCQUFBO0VBQUEsbUJBQUE7RUFBQSxvQkFBQTtFQUFBLGdCQUFBO0VBQUEsMEJBQUE7RUFDQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQTtBQURBOztBQUlGO0VBQ0Usa0NBQUE7QUFDRjs7QUFHRTtFQUFBLHdCQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBO0FBQUE7QUFHRTtFQUFBLG9CQUFBO0VBQUE7QUFBQTtBQUdFO0VBQUEsb0JBQUE7RUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLm5hdmlnYXRpb24taXRlbSB7XG4gIEBhcHBseSByb3VuZGVkIGN1cnNvci1wb2ludGVyIHRleHQtc20gZm9udC1tZWRpdW0gcHgtNCBweS0yIHJlbGF0aXZlIHNlbGVjdC1ub25lIG5vLXVuZGVybGluZSBibG9jayBtZS0yO1xuICBAYXBwbHkgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNDAwIGVhc2Utb3V0LXN3aWZ0O1xufVxuXG4ubmF2aWdhdGlvbi1jb2xvciB7XG4gIGNvbG9yOiB2YXIoLS12ZXgtbmF2aWdhdGlvbi1jb2xvcik7XG59XG5cbi5uYXZpZ2F0aW9uLW1lbnUtaXRlbSB7XG4gIEBhcHBseSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi00MDAgZWFzZS1vdXQtc3dpZnQ7XG5cbiAgJjpob3ZlciB7XG4gICAgQGFwcGx5IHRleHQtcHJpbWFyeS02MDA7XG5cbiAgICAubWF0LWljb24ge1xuICAgICAgQGFwcGx5IHRleHQtcHJpbWFyeS02MDA7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 99373:
/*!***********************************************************************!*\
  !*** ./src/app/layouts/components/navigation/navigation.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationComponent: () => (/* binding */ NavigationComponent)
/* harmony export */ });
/* harmony import */ var _navigation_item_navigation_item_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navigation-item/navigation-item.component */ 9208);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/navigation/navigation.service */ 20120);




function NavigationComponent_vex_navigation_item_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "vex-navigation-item", 3);
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("item", item_r1);
  }
}
class NavigationComponent {
  constructor(navigationService) {
    this.navigationService = navigationService;
    this.items$ = this.navigationService.items$;
  }
  static #_ = this.ɵfac = function NavigationComponent_Factory(t) {
    return new (t || NavigationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_1__.NavigationService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: NavigationComponent,
    selectors: [["vex-navigation"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 4,
    vars: 3,
    consts: [[1, "border-b"], [1, "navigation", "flex", "items-center", "container"], [3, "item", 4, "ngFor", "ngForOf"], [3, "item"]],
    template: function NavigationComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, NavigationComponent_vex_navigation_item_2_Template, 1, 1, "vex-navigation-item", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 1, ctx.items$));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgFor, _navigation_item_navigation_item_component__WEBPACK_IMPORTED_MODULE_0__.NavigationItemComponent, _angular_common__WEBPACK_IMPORTED_MODULE_3__.AsyncPipe],
    styles: ["[_nghost-%COMP%] {\n  background: var(--vex-navigation-background);\n  display: block;\n  height: var(--vex-navigation-height);\n  position: relative;\n  z-index: 200;\n}\n\n.navigation[_ngcontent-%COMP%] {\n  height: var(--vex-navigation-height);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLDRDQUFBO0VBQ0EsY0FBQTtFQUNBLG9DQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0FBQ0Y7O0FBRUE7RUFDRSxvQ0FBQTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtbmF2aWdhdGlvbi1iYWNrZ3JvdW5kKTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGhlaWdodDogdmFyKC0tdmV4LW5hdmlnYXRpb24taGVpZ2h0KTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAyMDA7XG59XG5cbi5uYXZpZ2F0aW9uIHtcbiAgaGVpZ2h0OiB2YXIoLS12ZXgtbmF2aWdhdGlvbi1oZWlnaHQpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 74132:
/*!***********************************************************************!*\
  !*** ./src/app/layouts/components/quickpanel/quickpanel.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuickpanelComponent: () => (/* binding */ QuickpanelComponent)
/* harmony export */ });
/* harmony import */ var luxon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! luxon */ 17765);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-bar */ 78173);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/list */ 13228);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/divider */ 69400);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);











const _c0 = () => [];
class QuickpanelComponent {
  constructor() {
    this.date = luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().toFormat('DD');
    this.dayName = luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().toFormat('EEEE');
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function QuickpanelComponent_Factory(t) {
    return new (t || QuickpanelComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: QuickpanelComponent,
    selectors: [["vex-quickpanel"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 67,
    vars: 19,
    consts: [[1, "body-2", "p-6", "bg-primary-600", "text-on-primary-600"], [1, "display-1"], ["matSubheader", ""], ["mat-list-item", "", 3, "routerLink"], ["matListItemTitle", ""], ["matListItemLine", ""], ["matRipple", "", 1, "vex-list-item"], [1, "progress-bar"], ["color", "primary", "mode", "determinate", 3, "value"], ["color", "accent", "mode", "determinate", 3, "value"], ["color", "warn", "mode", "determinate", 3, "value"]],
    template: function QuickpanelComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Today");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-nav-list")(9, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "UPCOMING EVENTS");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "a", 3)(12, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Business Meeting");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "In 16 Minutes, Meeting Room");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "a", 3)(17, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Ask for Vacation");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "12:00 PM");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "a", 3)(22, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Dinner with Sophie");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, "18:30 PM");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "a", 3)(27, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "Deadline for Project X");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "21:00 PM");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](31, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "TODO-LIST");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "a", 3)(35, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "Invite Jack to play golf");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, "Added: 6 hours ago");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "a", 3)(40, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Get to know Angular more");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "Added: 2 days ago");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "a", 3)(45, "h4", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](46, "Configure that new router");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](48, "Added: 5 days ago");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](49, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51, "SERVER STATISTICS");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "div", 6)(53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, "CPU Load (71% / 100%)");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](56, "mat-progress-bar", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "div", 6)(58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](59, "RAM Usage (6,175 MB / 16,384 MB)");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](60, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](61, "mat-progress-bar", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "div", 6)(63, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](64, "CPU Temp (43\u00B0 / 80\u00B0)");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](66, "mat-progress-bar", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.dayName);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.date);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](12, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](13, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](14, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](15, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](16, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](17, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](18, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 71);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 54);
      }
    },
    dependencies: [_angular_material_divider__WEBPACK_IMPORTED_MODULE_2__.MatDividerModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_2__.MatDivider, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatNavList, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListItem, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListSubheaderCssMatStyler, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListItemLine, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListItemTitle, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_material_core__WEBPACK_IMPORTED_MODULE_5__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_5__.MatRipple, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_6__.MatProgressBarModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_6__.MatProgressBar],
    styles: ["[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  max-width: 80vw;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.vex-list-item[_ngcontent-%COMP%] {\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  min-height: 72px;\n  position: relative;\n  -webkit-user-select: none;\n          user-select: none;\n  padding: 1rem;\n  padding-top: 0px;\n}\n.vex-list-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-background-hover);\n}\n\n.progress-bar[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3F1aWNrcGFuZWwvcXVpY2twYW5lbC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7RUFFQSxlQUFBO0FBQUY7O0FBR0E7RUFDRSxTQUFBO0FBQUY7O0FBR0E7RUFDRSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtFQUNBLGFBQUE7RUFBQSxnQkFBQTtBQUFGO0FBRUU7RUFDRSx1Q0FBQTtBQUFKOztBQUlBO0VBQ0UsZUFBQTtBQURGIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG5cbiAgbWF4LXdpZHRoOiA4MHZ3O1xufVxuXG5wIHtcbiAgbWFyZ2luOiAwO1xufVxuXG4udmV4LWxpc3QtaXRlbSB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1pbi1oZWlnaHQ6IDcycHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIEBhcHBseSBwLTQgcHQtMDtcblxuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3Zlcik7XG4gIH1cbn1cblxuLnByb2dyZXNzLWJhciB7XG4gIG1hcmdpbi10b3A6IDhweDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 64914:
/*!***********************************************************************************!*\
  !*** ./src/app/layouts/components/sidenav/search-modal/search-modal.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchModalComponent: () => (/* binding */ SearchModalComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);








class SearchModalComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function SearchModalComponent_Factory(t) {
    return new (t || SearchModalComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: SearchModalComponent,
    selectors: [["vex-search-modal"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 66,
    vars: 0,
    consts: [[1, "flex", "items-center", "gap-4", "px-6", "py-3", "border-b", "border-divider"], ["svgIcon", "mat:search", 1, "text-secondary", "flex-none"], ["type", "text", "placeholder", "Search...", 1, "text-xl", "font-medium", "bg-transparent", "outline-none", "flex-auto", "placeholder-secondary"], ["type", "button", "mat-icon-button", "", 1, "flex-none", "ltr:-mr-2", "rtl:-ml-2", "text-secondary"], ["svgIcon", "mat:settings"], [1, "p-4"], [1, "text-xs", "font-semibold", "text-secondary", "px-2", "mb-2"], [1, "space-y-1"], ["matRipple", "", 1, "px-2", "py-2", "hover:bg-hover", "rounded", "transition", "duration-200", "ease-out", "flex", "items-center", "gap-4", "cursor-pointer", "select-none"], ["src", "assets/img/avatars/4.jpg", 1, "w-8", "h-8", "rounded-full", "flex-none"], [1, "flex-auto", "text-base", "font-medium"], [1, "flex-none", "text-xs", "text-secondary", "font-medium", "flex", "items-center", "gap-2"], ["svgIcon", "mat:contacts", 1, "icon-xs", "flex-none"], ["svgIcon", "mat:chevron_right", 1, "icon-sm", "flex-none"], ["src", "assets/img/avatars/3.jpg", 1, "w-8", "h-8", "rounded-full", "flex-none"], [1, "flex", "items-center", "justify-center", "w-8", "h-8", "rounded-full", "bg-foreground/20"], ["svgIcon", "mat:web", 1, "icon-sm", "flex-none"], [1, "text-secondary", "text-xs"], ["svgIcon", "mat:check", "color", "primary", 1, "icon-sm", "flex-none"]],
    template: function SearchModalComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "mat-icon", 1)(3, "input", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5)(7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Contacts ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7)(10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Alice Miller");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 11)(15, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "found in Contacts");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "img", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Frank White");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 11)(24, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "found in Contacts");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 5)(29, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Pages");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 7)(32, "div", 8)(33, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 10)(36, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Scrumboard");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "/apps/scrumboard");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 8)(42, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](43, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 10)(45, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, "Mailbox");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "/apps/mailbox");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](49, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 5)(51, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Tasks");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 7)(54, "div", 8)(55, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](56, "mat-icon", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, " Configure OrderController as defined in RVT-11 ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](59, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 8)(61, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](62, "mat-icon", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, " Add more data-models to product-controller ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](65, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatIconButton, _angular_material_core__WEBPACK_IMPORTED_MODULE_4__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_4__.MatRipple]
  });
}

/***/ }),

/***/ 86463:
/*!***********************************************************************************!*\
  !*** ./src/app/layouts/components/sidenav/sidenav-item/sidenav-item.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidenavItemComponent: () => (/* binding */ SidenavItemComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_animations_dropdown_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/dropdown.animation */ 93943);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 60839);
/* harmony import */ var _core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/navigation/navigation.service */ 20120);













function SidenavItemComponent_a_0_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-icon", 7);
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("svgIcon", ctx_r4.item.icon);
  }
}
const _c0 = (a0, a1) => [a0, a1];
function SidenavItemComponent_a_0_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c0, ctx_r5.item.badge.bgClass, ctx_r5.item.badge.textClass));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r5.item.badge.value);
  }
}
const _c1 = () => ({
  exact: false
});
function SidenavItemComponent_a_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SidenavItemComponent_a_0_mat_icon_1_Template, 1, 1, "mat-icon", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, SidenavItemComponent_a_0_span_4_Template, 2, 5, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("fragment", ctx_r0.item.fragment)("routerLinkActiveOptions", ctx_r0.item.routerLinkActiveOptions || _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](6, _c1))("routerLink", ctx_r0.item.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.level === 0 && ctx_r0.item.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r0.item.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.item.badge);
  }
}
function SidenavItemComponent_div_1_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-icon", 7);
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("svgIcon", ctx_r6.item.icon);
  }
}
function SidenavItemComponent_div_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c0, ctx_r7.item.badge.bgClass, ctx_r7.item.badge.textClass));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r7.item.badge.value);
  }
}
function SidenavItemComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SidenavItemComponent_div_1_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r8.item.route());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SidenavItemComponent_div_1_mat_icon_1_Template, 1, 1, "mat-icon", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, SidenavItemComponent_div_1_span_4_Template, 2, 5, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.level === 0 && ctx_r1.item.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.item.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.item.badge);
  }
}
function SidenavItemComponent_ng_container_2_mat_icon_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-icon", 7);
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("svgIcon", ctx_r10.item.icon);
  }
}
function SidenavItemComponent_ng_container_2_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c0, ctx_r11.item.badge.bgClass, ctx_r11.item.badge.textClass));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r11.item.badge.value);
  }
}
function SidenavItemComponent_ng_container_2_vex_sidenav_item_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "vex-sidenav-item", 14);
  }
  if (rf & 2) {
    const subItem_r13 = ctx.$implicit;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("item", subItem_r13)("level", ctx_r12.level + 1);
  }
}
function SidenavItemComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SidenavItemComponent_ng_container_2_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r15);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r14.toggleOpen());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, SidenavItemComponent_ng_container_2_mat_icon_2_Template, 1, 1, "mat-icon", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, SidenavItemComponent_ng_container_2_span_5_Template, 2, 5, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "mat-icon", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, SidenavItemComponent_ng_container_2_vex_sidenav_item_8_Template, 1, 2, "vex-sidenav-item", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("vex-sidenav-item--active", ctx_r2.isOpen || ctx_r2.isActive)("vex-sidenav-item--open", ctx_r2.isOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r2.level === 0 && ctx_r2.item.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r2.item.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r2.item.badge);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("@dropdown", ctx_r2.isOpen);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r2.item.children);
  }
}
function SidenavItemComponent_ng_container_3_vex_sidenav_item_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "vex-sidenav-item", 14);
  }
  if (rf & 2) {
    const subItem_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("item", subItem_r17)("level", 0);
  }
}
function SidenavItemComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, SidenavItemComponent_ng_container_3_vex_sidenav_item_3_Template, 1, 2, "vex-sidenav-item", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r3.item.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r3.item.children);
  }
}
class SidenavItemComponent {
  constructor(router, cd, navigationService) {
    this.router = router;
    this.cd = cd;
    this.navigationService = navigationService;
    this.isOpen = false;
    this.isActive = false;
    this.isLink = this.navigationService.isLink;
    this.isDropdown = this.navigationService.isDropdown;
    this.isSubheading = this.navigationService.isSubheading;
    this.destroyRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_2__.DestroyRef);
  }
  get levelClass() {
    return `item-level-${this.level}`;
  }
  ngOnInit() {
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_4__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(() => this.isDropdown(this.item)), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_5__.takeUntilDestroyed)(this.destroyRef)).subscribe(() => this.onRouteChange());
    this.navigationService.openChange$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(() => this.isDropdown(this.item)), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_5__.takeUntilDestroyed)(this.destroyRef)).subscribe(item => this.onOpenChange(item));
  }
  ngOnChanges(changes) {
    if (changes && changes.hasOwnProperty('item') && this.isDropdown(this.item)) {
      this.onRouteChange();
    }
  }
  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.navigationService.triggerOpenChange(this.item);
    this.cd.markForCheck();
  }
  onOpenChange(item) {
    if (this.isChildrenOf(this.item, item)) {
      return;
    }
    if (this.hasActiveChilds(this.item)) {
      return;
    }
    if (this.item !== item) {
      this.isOpen = false;
      this.cd.markForCheck();
    }
  }
  onRouteChange() {
    if (this.hasActiveChilds(this.item)) {
      this.isActive = true;
      this.isOpen = true;
      this.navigationService.triggerOpenChange(this.item);
      this.cd.markForCheck();
    } else {
      this.isActive = false;
      this.isOpen = false;
      this.navigationService.triggerOpenChange(this.item);
      this.cd.markForCheck();
    }
  }
  isChildrenOf(parent, item) {
    if (parent.children.indexOf(item) !== -1) {
      return true;
    }
    return parent.children.filter(child => this.isDropdown(child)).some(child => this.isChildrenOf(child, item));
  }
  hasActiveChilds(parent) {
    return parent.children.some(child => {
      if (this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }
      if (this.isLink(child) && !this.isFunction(child.route)) {
        return this.router.isActive(child.route, false);
      }
    });
  }
  isFunction(prop) {
    return prop instanceof Function;
  }
  static #_ = this.ɵfac = function SidenavItemComponent_Factory(t) {
    return new (t || SidenavItemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_1__.NavigationService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: SidenavItemComponent,
    selectors: [["vex-sidenav-item"]],
    hostVars: 2,
    hostBindings: function SidenavItemComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassMap"](ctx.levelClass);
      }
    },
    inputs: {
      item: "item",
      level: "level"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 4,
    vars: 4,
    consts: [["class", "vex-sidenav-item", "matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", "routerLinkActive", "vex-sidenav-item--active", 3, "fragment", "routerLinkActiveOptions", "routerLink", 4, "ngIf"], ["class", "vex-sidenav-item", "matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", "routerLinkActive", "vex-sidenav-item--active", 3, "click", 4, "ngIf"], [4, "ngIf"], ["matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", "routerLinkActive", "vex-sidenav-item--active", 1, "vex-sidenav-item", 3, "fragment", "routerLinkActiveOptions", "routerLink"], ["class", "vex-sidenav-item__icon", 3, "svgIcon", 4, "ngIf"], [1, "vex-sidenav-item__label"], ["class", "vex-sidenav-item__badge", 3, "ngClass", 4, "ngIf"], [1, "vex-sidenav-item__icon", 3, "svgIcon"], [1, "vex-sidenav-item__badge", 3, "ngClass"], ["matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", "routerLinkActive", "vex-sidenav-item--active", 1, "vex-sidenav-item", 3, "click"], ["matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", 1, "vex-sidenav-item", 3, "click"], ["svgIcon", "mat:keyboard_arrow_right", 1, "vex-sidenav-item__dropdown-icon"], [1, "vex-sidenav-item__dropdown"], [3, "item", "level", 4, "ngFor", "ngForOf"], [3, "item", "level"], [1, "vex-sidenav-subheading"]],
    template: function SidenavItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, SidenavItemComponent_a_0_Template, 5, 7, "a", 0)(1, SidenavItemComponent_div_1_Template, 5, 3, "div", 1)(2, SidenavItemComponent_ng_container_2_Template, 9, 9, "ng-container", 2)(3, SidenavItemComponent_ng_container_3_Template, 4, 2, "ng-container", 2);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLink(ctx.item) && !ctx.isFunction(ctx.item.route));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLink(ctx.item) && ctx.isFunction(ctx.item.route));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isDropdown(ctx.item));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isSubheading(ctx.item));
      }
    },
    dependencies: [SidenavItemComponent, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRipple, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLinkActive, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgFor],
    styles: [".vex-sidenav-item[_ngcontent-%COMP%] {\n  align-items: center;\n  box-sizing: border-box;\n  color: var(--vex-sidenav-item-color);\n  cursor: pointer;\n  display: flex;\n  flex-direction: row;\n  min-height: var(--vex-sidenav-item-min-height);\n  padding: var(--vex-sidenav-item-padding-vertical) var(--vex-sidenav-item-padding-horizontal);\n  position: relative;\n  text-decoration: none;\n  -webkit-user-select: none;\n          user-select: none;\n  font-weight: var(--vex-sidenav-item-font-weight);\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-background-active);\n}\n.vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__icon[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-icon-color-active);\n}\n.vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-color-active);\n}\n.vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__dropdown-icon[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-color-active);\n}\n.vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-background-hover);\n}\n.vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__icon[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-icon-color-hover);\n}\n.vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-color-hover);\n}\n.vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__dropdown-icon[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-color-hover);\n}\n.vex-sidenav-item.vex-sidenav-item--open[_ngcontent-%COMP%]   .vex-sidenav-item__dropdown-icon[_ngcontent-%COMP%] {\n  transform: rotate(90deg) !important;\n}\n\n.item-level-1[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background);\n  padding-inline-start: calc(var(--vex-sidenav-item-icon-size) + var(--vex-sidenav-item-icon-gap) + var(--vex-sidenav-item-padding-horizontal) + var(--vex-sidenav-item-dropdown-gap) * 0);\n}\n.item-level-1[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background-active);\n}\n.item-level-1[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-active);\n}\n.item-level-1[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-dropdown-background-hover);\n}\n.item-level-1[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-hover);\n}\n\n.item-level-2[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background);\n  padding-inline-start: calc(var(--vex-sidenav-item-icon-size) + var(--vex-sidenav-item-icon-gap) + var(--vex-sidenav-item-padding-horizontal) + var(--vex-sidenav-item-dropdown-gap) * 1);\n}\n.item-level-2[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background-active);\n}\n.item-level-2[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-active);\n}\n.item-level-2[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-dropdown-background-hover);\n}\n.item-level-2[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-hover);\n}\n\n.item-level-3[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background);\n  padding-inline-start: calc(var(--vex-sidenav-item-icon-size) + var(--vex-sidenav-item-icon-gap) + var(--vex-sidenav-item-padding-horizontal) + var(--vex-sidenav-item-dropdown-gap) * 2);\n}\n.item-level-3[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background-active);\n}\n.item-level-3[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-active);\n}\n.item-level-3[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-dropdown-background-hover);\n}\n.item-level-3[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-hover);\n}\n\n.item-level-4[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background);\n  padding-inline-start: calc(var(--vex-sidenav-item-icon-size) + var(--vex-sidenav-item-icon-gap) + var(--vex-sidenav-item-padding-horizontal) + var(--vex-sidenav-item-dropdown-gap) * 3);\n}\n.item-level-4[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background-active);\n}\n.item-level-4[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-active);\n}\n.item-level-4[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-dropdown-background-hover);\n}\n.item-level-4[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-hover);\n}\n\n.item-level-5[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background);\n  padding-inline-start: calc(var(--vex-sidenav-item-icon-size) + var(--vex-sidenav-item-icon-gap) + var(--vex-sidenav-item-padding-horizontal) + var(--vex-sidenav-item-dropdown-gap) * 4);\n}\n.item-level-5[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background-active);\n}\n.item-level-5[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-active);\n}\n.item-level-5[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-dropdown-background-hover);\n}\n.item-level-5[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-hover);\n}\n\n.item-level-6[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background);\n  padding-inline-start: calc(var(--vex-sidenav-item-icon-size) + var(--vex-sidenav-item-icon-gap) + var(--vex-sidenav-item-padding-horizontal) + var(--vex-sidenav-item-dropdown-gap) * 5);\n}\n.item-level-6[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-item-dropdown-background-active);\n}\n.item-level-6[_nghost-%COMP%]   .vex-sidenav-item.vex-sidenav-item--active[_ngcontent-%COMP%]   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-active);\n}\n.item-level-6[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover {\n  background: var(--vex-sidenav-item-dropdown-background-hover);\n}\n.item-level-6[_nghost-%COMP%]   .vex-sidenav-item[_ngcontent-%COMP%]:hover   .vex-sidenav-item__label[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-dropdown-color-hover);\n}\n\n.vex-sidenav-item__icon[_ngcontent-%COMP%], .vex-sidenav-item__label[_ngcontent-%COMP%], .vex-sidenav-item__dropdown-icon[_ngcontent-%COMP%] {\n  transition: inherit;\n}\n\n.vex-sidenav-item__icon[_ngcontent-%COMP%] {\n  flex: none;\n  color: var(--vex-sidenav-item-icon-color);\n  font-size: var(--vex-sidenav-item-icon-size);\n  height: var(--vex-sidenav-item-icon-size);\n  margin-inline-end: var(--vex-sidenav-item-icon-gap);\n  width: var(--vex-sidenav-item-icon-size);\n}\n\n.vex-sidenav-item__label[_ngcontent-%COMP%] {\n  flex: auto;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.vex-sidenav-item__badge[_ngcontent-%COMP%] {\n  flex: none;\n  border-radius: 9999px;\n  font-size: 11px;\n  line-height: 20px;\n  padding: 0 7px;\n  text-align: center;\n  font-weight: 700;\n  margin-inline-start: 0.5rem;\n}\n\n.vex-sidenav-item__dropdown-icon[_ngcontent-%COMP%] {\n  color: var(--vex-sidenav-item-icon-color);\n  font-size: 18px;\n  height: 18px;\n  line-height: 18px;\n  transform: rotate(0deg) !important;\n  width: 18px;\n  margin-inline-start: 0.5rem;\n}\n\n.vex-sidenav-item__dropdown[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n\n.vex-sidenav-subheading[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  color: var(--vex-sidenav-subheading-color);\n  text-transform: uppercase;\n  white-space: nowrap;\n  font-weight: 600;\n  -webkit-user-select: none;\n          user-select: none;\n  margin-top: 1.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n\n\n\n[_nghost-%COMP%]:first-child   .vex-sidenav-subheading[_ngcontent-%COMP%] {\n  margin-top: -0.75rem;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3NpZGVuYXYvc2lkZW5hdi1pdGVtL3NpZGVuYXYtaXRlbS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG1CQUFBO0VBQ0Esc0JBQUE7RUFDQSxvQ0FBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4Q0FBQTtFQUNBLDRGQUFBO0VBQ0Esa0JBQUE7RUFDQSxxQkFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7RUFDQSxnREFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQSw0REFBQTtBQUNGO0FBQ0U7RUFDRSxxREFBQTtBQUNKO0FBQ0k7RUFDRSxnREFBQTtBQUNOO0FBRUk7RUFDRSwyQ0FBQTtBQUFOO0FBR0k7RUFDRSwyQ0FBQTtBQUROO0FBS0U7RUFDRSxvREFBQTtBQUhKO0FBS0k7RUFDRSwrQ0FBQTtBQUhOO0FBTUk7RUFDRSwwQ0FBQTtBQUpOO0FBT0k7RUFDRSwwQ0FBQTtBQUxOO0FBVUk7RUFDRSxtQ0FBQTtBQVJOOztBQWNFO0VBQ0UsdURBQUE7RUFDQSx3TEFBQTtBQVhKO0FBa0JJO0VBQ0UsOERBQUE7QUFoQk47QUFrQk07RUFDRSxvREFBQTtBQWhCUjtBQW9CSTtFQUNFLDZEQUFBO0FBbEJOO0FBb0JNO0VBQ0UsbURBQUE7QUFsQlI7O0FBSEU7RUFDRSx1REFBQTtFQUNBLHdMQUFBO0FBTUo7QUFDSTtFQUNFLDhEQUFBO0FBQ047QUFDTTtFQUNFLG9EQUFBO0FBQ1I7QUFHSTtFQUNFLDZEQUFBO0FBRE47QUFHTTtFQUNFLG1EQUFBO0FBRFI7O0FBcEJFO0VBQ0UsdURBQUE7RUFDQSx3TEFBQTtBQXVCSjtBQWhCSTtFQUNFLDhEQUFBO0FBa0JOO0FBaEJNO0VBQ0Usb0RBQUE7QUFrQlI7QUFkSTtFQUNFLDZEQUFBO0FBZ0JOO0FBZE07RUFDRSxtREFBQTtBQWdCUjs7QUFyQ0U7RUFDRSx1REFBQTtFQUNBLHdMQUFBO0FBd0NKO0FBakNJO0VBQ0UsOERBQUE7QUFtQ047QUFqQ007RUFDRSxvREFBQTtBQW1DUjtBQS9CSTtFQUNFLDZEQUFBO0FBaUNOO0FBL0JNO0VBQ0UsbURBQUE7QUFpQ1I7O0FBdERFO0VBQ0UsdURBQUE7RUFDQSx3TEFBQTtBQXlESjtBQWxESTtFQUNFLDhEQUFBO0FBb0ROO0FBbERNO0VBQ0Usb0RBQUE7QUFvRFI7QUFoREk7RUFDRSw2REFBQTtBQWtETjtBQWhETTtFQUNFLG1EQUFBO0FBa0RSOztBQXZFRTtFQUNFLHVEQUFBO0VBQ0Esd0xBQUE7QUEwRUo7QUFuRUk7RUFDRSw4REFBQTtBQXFFTjtBQW5FTTtFQUNFLG9EQUFBO0FBcUVSO0FBakVJO0VBQ0UsNkRBQUE7QUFtRU47QUFqRU07RUFDRSxtREFBQTtBQW1FUjs7QUE3REE7OztFQUdFLG1CQUFBO0FBZ0VGOztBQTdEQTtFQUNFLFVBQUE7RUFDQSx5Q0FBQTtFQUNBLDRDQUFBO0VBQ0EseUNBQUE7RUFDQSxtREFBQTtFQUNBLHdDQUFBO0FBZ0VGOztBQTdEQTtFQUNFLFVBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdUJBQUE7QUFnRUY7O0FBN0RBO0VBQ0UsVUFBQTtFQUNBLHFCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSwyQkFBQTtBQWdFRjs7QUE3REE7RUFDRSx5Q0FBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQ0FBQTtFQUNBLFdBQUE7RUFDQSwyQkFBQTtBQWdFRjs7QUE3REE7RUFDRSxnQkFBQTtBQWdFRjs7QUE3REE7RUFDRSxzQkFBQTtFQUNBLDBDQUFBO0VBQ0EseUJBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtFQUNBLGtCQUFBO0VBQUEsb0JBQUE7RUFBQSx1QkFBQTtFQUFBLG9CQUFBO0VBQUEscUJBQUE7RUFBQSxrQkFBQTtFQUFBLGlCQUFBO0FBZ0VGOztBQTdEQSxnREFBQTtBQUVFO0VBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi52ZXgtc2lkZW5hdi1pdGVtIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgY29sb3I6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tY29sb3IpO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIG1pbi1oZWlnaHQ6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tbWluLWhlaWdodCk7XG4gIHBhZGRpbmc6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tcGFkZGluZy12ZXJ0aWNhbCkgdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1wYWRkaW5nLWhvcml6b250YWwpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWZvbnQtd2VpZ2h0KTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIEBhcHBseSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi00MDAgZWFzZS1vdXQtc3dpZnQ7XG5cbiAgJi52ZXgtc2lkZW5hdi1pdGVtLS1hY3RpdmUge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tYmFja2dyb3VuZC1hY3RpdmUpO1xuXG4gICAgLnZleC1zaWRlbmF2LWl0ZW1fX2ljb24ge1xuICAgICAgY29sb3I6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1jb2xvci1hY3RpdmUpO1xuICAgIH1cblxuICAgIC52ZXgtc2lkZW5hdi1pdGVtX19sYWJlbCB7XG4gICAgICBjb2xvcjogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1jb2xvci1hY3RpdmUpO1xuICAgIH1cblxuICAgIC52ZXgtc2lkZW5hdi1pdGVtX19kcm9wZG93bi1pY29uIHtcbiAgICAgIGNvbG9yOiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWNvbG9yLWFjdGl2ZSk7XG4gICAgfVxuICB9XG5cbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1iYWNrZ3JvdW5kLWhvdmVyKTtcblxuICAgIC52ZXgtc2lkZW5hdi1pdGVtX19pY29uIHtcbiAgICAgIGNvbG9yOiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWljb24tY29sb3ItaG92ZXIpO1xuICAgIH1cblxuICAgIC52ZXgtc2lkZW5hdi1pdGVtX19sYWJlbCB7XG4gICAgICBjb2xvcjogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1jb2xvci1ob3Zlcik7XG4gICAgfVxuXG4gICAgLnZleC1zaWRlbmF2LWl0ZW1fX2Ryb3Bkb3duLWljb24ge1xuICAgICAgY29sb3I6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tY29sb3ItaG92ZXIpO1xuICAgIH1cbiAgfVxuXG4gICYudmV4LXNpZGVuYXYtaXRlbS0tb3BlbiB7XG4gICAgLnZleC1zaWRlbmF2LWl0ZW1fX2Ryb3Bkb3duLWljb24ge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG59XG5cbkBmb3IgJGkgZnJvbSAxIHRocm91Z2ggNiB7XG4gIDpob3N0KC5pdGVtLWxldmVsLSN7JGl9KSAudmV4LXNpZGVuYXYtaXRlbSB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1kcm9wZG93bi1iYWNrZ3JvdW5kKTtcbiAgICBwYWRkaW5nLWlubGluZS1zdGFydDogY2FsYyhcbiAgICAgIHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1zaXplKSArXG4gICAgICB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWljb24tZ2FwKSArXG4gICAgICB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLXBhZGRpbmctaG9yaXpvbnRhbCkgK1xuICAgICAgKHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tZHJvcGRvd24tZ2FwKSAqICN7JGkgLSAxfSlcbiAgICApO1xuXG4gICAgJi52ZXgtc2lkZW5hdi1pdGVtLS1hY3RpdmUge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1kcm9wZG93bi1iYWNrZ3JvdW5kLWFjdGl2ZSk7XG5cbiAgICAgIC52ZXgtc2lkZW5hdi1pdGVtX19sYWJlbCB7XG4gICAgICAgIGNvbG9yOiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWRyb3Bkb3duLWNvbG9yLWFjdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWRyb3Bkb3duLWJhY2tncm91bmQtaG92ZXIpO1xuXG4gICAgICAudmV4LXNpZGVuYXYtaXRlbV9fbGFiZWwge1xuICAgICAgICBjb2xvcjogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1kcm9wZG93bi1jb2xvci1ob3Zlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi52ZXgtc2lkZW5hdi1pdGVtX19pY29uLFxuLnZleC1zaWRlbmF2LWl0ZW1fX2xhYmVsLFxuLnZleC1zaWRlbmF2LWl0ZW1fX2Ryb3Bkb3duLWljb24ge1xuICB0cmFuc2l0aW9uOiBpbmhlcml0O1xufVxuXG4udmV4LXNpZGVuYXYtaXRlbV9faWNvbiB7XG4gIGZsZXg6IG5vbmU7XG4gIGNvbG9yOiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWljb24tY29sb3IpO1xuICBmb250LXNpemU6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWljb24tc2l6ZSk7XG4gIG1hcmdpbi1pbmxpbmUtZW5kOiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWljb24tZ2FwKTtcbiAgd2lkdGg6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1zaXplKTtcbn1cblxuLnZleC1zaWRlbmF2LWl0ZW1fX2xhYmVsIHtcbiAgZmxleDogYXV0bztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG59XG5cbi52ZXgtc2lkZW5hdi1pdGVtX19iYWRnZSB7XG4gIGZsZXg6IG5vbmU7XG4gIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBsaW5lLWhlaWdodDogMjBweDtcbiAgcGFkZGluZzogMCA3cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgQGFwcGx5IG1zLTI7XG59XG5cbi52ZXgtc2lkZW5hdi1pdGVtX19kcm9wZG93bi1pY29uIHtcbiAgY29sb3I6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1jb2xvcik7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgaGVpZ2h0OiAxOHB4O1xuICBsaW5lLWhlaWdodDogMThweDtcbiAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZykgIWltcG9ydGFudDtcbiAgd2lkdGg6IDE4cHg7XG4gIEBhcHBseSBtcy0yO1xufVxuXG4udmV4LXNpZGVuYXYtaXRlbV9fZHJvcGRvd24ge1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4udmV4LXNpZGVuYXYtc3ViaGVhZGluZyB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGNvbG9yOiB2YXIoLS12ZXgtc2lkZW5hdi1zdWJoZWFkaW5nLWNvbG9yKTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIEBhcHBseSB0ZXh0LXhzIHB5LTMgcHgtNiBtdC02O1xufVxuXG4vKiogSWYgZmlyc3QgaXRlbSBpcyBzdWJoZWFkaW5nLCByZW1vdmUgbWFyZ2luICovXG46aG9zdCg6Zmlyc3QtY2hpbGQpIC52ZXgtc2lkZW5hdi1zdWJoZWFkaW5nIHtcbiAgQGFwcGx5IC1tdC0zO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_dropdown_animation__WEBPACK_IMPORTED_MODULE_0__.dropdownAnimation]
    },
    changeDetection: 0
  });
}

/***/ }),

/***/ 43569:
/*!*********************************************************************************************!*\
  !*** ./src/app/layouts/components/sidenav/sidenav-user-menu/sidenav-user-menu.component.ts ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidenavUserMenuComponent: () => (/* binding */ SidenavUserMenuComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_components_vex_popover_vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover-ref */ 95925);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 90304);








const _c0 = () => ["/apps/social"];
const _c1 = () => ["/"];
class SidenavUserMenuComponent {
  constructor(popoverRef, authService) {
    this.popoverRef = popoverRef;
    this.authService = authService;
  }
  ngOnInit() {}
  close() {
    this.popoverRef.close();
  }
  logout() {
    console.log('SidenavUserMenuComponent: Iniciando logout...');
    try {
      this.authService.logout().subscribe({
        next: () => {
          console.log('SidenavUserMenuComponent: Logout exitoso');
          this.close();
          // El servicio ya maneja la redirección
        },

        error: error => {
          console.error('SidenavUserMenuComponent: Error en logout:', error);
          this.close();
          // El servicio ya maneja la redirección incluso en caso de error
        }
      });
    } catch (error) {
      console.error('SidenavUserMenuComponent: Error al ejecutar logout:', error);
      this.close();
    }
  }
  static #_ = this.ɵfac = function SidenavUserMenuComponent_Factory(t) {
    return new (t || SidenavUserMenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__.VexPopoverRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: SidenavUserMenuComponent,
    selectors: [["vex-sidenav-user-menu"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 15,
    vars: 4,
    consts: [[1, "vex-user-menu"], ["matRipple", "", "matRippleColor", "rgb(var(--vex-color-primary-600), 0.1)", 1, "vex-user-menu-item", 3, "routerLink", "click"], ["svgIcon", "mat:settings", 1, "vex-user-menu-item__icon", "icon-sm"], [1, "vex-user-menu-item__label"], ["svgIcon", "mat:insights", 1, "vex-user-menu-item__icon", "icon-sm"], [1, "vex-user-menu-item__badge"], ["matRipple", "", "matRippleColor", "rgba(239, 68, 68, 0.1)", 1, "vex-user-menu-item", 2, "cursor", "pointer", "user-select", "none", "border-top", "1px solid rgba(255,255,255,0.1)", "margin-top", "8px", "padding-top", "12px", "color", "#EF4444", 3, "click"], ["svgIcon", "mat:logout", 1, "vex-user-menu-item__icon", "icon-sm", 2, "color", "#EF4444"], [1, "vex-user-menu-item__label", 2, "color", "#EF4444"]],
    template: function SidenavUserMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SidenavUserMenuComponent_Template_a_click_1_listener() {
          return ctx.close();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Configuraci\u00F3n de Cuenta");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SidenavUserMenuComponent_Template_a_click_5_listener() {
          return ctx.close();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "Anal\u00EDticas");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "NUEVO");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SidenavUserMenuComponent_Template_a_click_11_listener() {
          return ctx.logout();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](12, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, "Cerrar Sesi\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](2, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](3, _c1));
      }
    },
    dependencies: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIcon, _angular_material_core__WEBPACK_IMPORTED_MODULE_4__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_4__.MatRipple, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink],
    styles: [".vex-user-menu[_ngcontent-%COMP%] {\n\n    border-radius: var(--vex-border-radius);\n\n    border-width: 1px;\n\n    border-color: var(--vex-foreground-divider);\n\n    --tw-bg-opacity: 1;\n\n    background-color: rgb(var(--vex-background-card-rgb) / var(--tw-bg-opacity));\n\n    padding-top: 0.5rem;\n\n    padding-bottom: 0.5rem;\n\n    --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n\n    --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n\n    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)\n}\n\n.vex-user-menu-item[_ngcontent-%COMP%] {\n\n    position: relative;\n\n    margin-left: 0.5rem;\n\n    margin-right: 0.5rem;\n\n    display: flex;\n\n    height: 2.5rem;\n\n    cursor: pointer;\n\n    -webkit-user-select: none;\n\n            user-select: none;\n\n    align-items: center;\n\n    gap: 1rem;\n\n    border-radius: var(--vex-border-radius);\n\n    padding-left: 0.5rem;\n\n    padding-right: 0.5rem;\n\n    padding-top: 0.5rem;\n\n    padding-bottom: 0.5rem;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n\n    transition-duration: 100ms;\n\n    transition-timing-function: cubic-bezier(0, 0, 0.2, 1)\n}\n\n.vex-user-menu-item[_ngcontent-%COMP%]:hover {\n\n    background-color: rgb(var(--vex-color-primary-600) / 0.1)\n}\n.vex-user-menu-item[_ngcontent-%COMP%]:hover   .vex-user-menu-item__icon[_ngcontent-%COMP%] {\n\n    --tw-text-opacity: 1;\n\n    color: rgb(var(--vex-color-primary-600) / var(--tw-text-opacity))\n}\n\n.vex-user-menu-item__label[_ngcontent-%COMP%] {\n\n    flex: 1 1 auto;\n\n    font-weight: 500;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n\n    transition-duration: 100ms;\n\n    transition-timing-function: cubic-bezier(0, 0, 0.2, 1)\n}\n\n.vex-user-menu-item__badge[_ngcontent-%COMP%] {\n\n    flex: none;\n\n    border-radius: var(--vex-border-radius);\n\n    background-color: rgb(var(--vex-color-primary-600) / 0.1);\n\n    padding-left: 0.5rem;\n\n    padding-right: 0.5rem;\n\n    padding-top: 0.25rem;\n\n    padding-bottom: 0.25rem;\n\n    font-size: 0.625rem;\n\n    font-weight: 600;\n\n    --tw-text-opacity: 1;\n\n    color: rgb(var(--vex-color-primary-600) / var(--tw-text-opacity))\n}\n\n.vex-user-menu-item__icon[_ngcontent-%COMP%] {\n\n    flex: none;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n\n    transition-duration: 100ms;\n\n    transition-timing-function: cubic-bezier(0, 0, 0.2, 1)\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3NpZGVuYXYvc2lkZW5hdi11c2VyLW1lbnUvc2lkZW5hdi11c2VyLW1lbnUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7O0lBQUEsdUNBQUE7O0lBQUEsaUJBQUE7O0lBQUEsMkNBQUE7O0lBQUEsa0JBQUE7O0lBQUEsNEVBQUE7O0lBQUEsbUJBQUE7O0lBQUEsc0JBQUE7O0lBQUEsK0VBQUE7O0lBQUEsbUdBQUE7O0lBQUE7QUFBQTs7QUFJQTs7SUFBQSxrQkFBQTs7SUFBQSxtQkFBQTs7SUFBQSxvQkFBQTs7SUFBQSxhQUFBOztJQUFBLGNBQUE7O0lBQUEsZUFBQTs7SUFBQSx5QkFBQTs7WUFBQSxpQkFBQTs7SUFBQSxtQkFBQTs7SUFBQSxTQUFBOztJQUFBLHVDQUFBOztJQUFBLG9CQUFBOztJQUFBLHFCQUFBOztJQUFBLG1CQUFBOztJQUFBLHNCQUFBOztJQUFBLGdLQUFBOztJQUFBLHdKQUFBOztJQUFBLGlMQUFBOztJQUFBLHdEQUFBOztJQUFBLDBCQUFBOztJQUFBO0FBQUE7O0FBQUE7O0lBQUE7QUFBQTtBQUlJOztJQUFBLG9CQUFBOztJQUFBO0FBQUE7O0FBTUo7O0lBQUEsY0FBQTs7SUFBQSxnQkFBQTs7SUFBQSxnS0FBQTs7SUFBQSx3SkFBQTs7SUFBQSxpTEFBQTs7SUFBQSx3REFBQTs7SUFBQSwwQkFBQTs7SUFBQTtBQUFBOztBQUlBOztJQUFBLFVBQUE7O0lBQUEsdUNBQUE7O0lBQUEseURBQUE7O0lBQUEsb0JBQUE7O0lBQUEscUJBQUE7O0lBQUEsb0JBQUE7O0lBQUEsdUJBQUE7O0lBQUEsbUJBQUE7O0lBQUEsZ0JBQUE7O0lBQUEsb0JBQUE7O0lBQUE7QUFBQTs7QUFJQTs7SUFBQSxVQUFBOztJQUFBLGdLQUFBOztJQUFBLHdKQUFBOztJQUFBLGlMQUFBOztJQUFBLHdEQUFBOztJQUFBLDBCQUFBOztJQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIudmV4LXVzZXItbWVudSB7XG4gIEBhcHBseSBiZy1mb3JlZ3JvdW5kIHNoYWRvdy1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXIgcm91bmRlZCBweS0yO1xufVxuXG4udmV4LXVzZXItbWVudS1pdGVtIHtcbiAgQGFwcGx5IHJlbGF0aXZlIGZsZXggaXRlbXMtY2VudGVyIGdhcC00IHB4LTIgbXgtMiBweS0yIHJvdW5kZWQgaG92ZXI6YmctcHJpbWFyeS02MDAvMTAgY3Vyc29yLXBvaW50ZXIgdHJhbnNpdGlvbiBkdXJhdGlvbi0xMDAgZWFzZS1vdXQgc2VsZWN0LW5vbmUgaC0xMDtcblxuICAmOmhvdmVyIHtcbiAgICAudmV4LXVzZXItbWVudS1pdGVtX19pY29uIHtcbiAgICAgIEBhcHBseSB0ZXh0LXByaW1hcnktNjAwO1xuICAgIH1cbiAgfVxufVxuXG4udmV4LXVzZXItbWVudS1pdGVtX19sYWJlbCB7XG4gIEBhcHBseSBmbGV4LWF1dG8gZm9udC1tZWRpdW0gdHJhbnNpdGlvbiBkdXJhdGlvbi0xMDAgZWFzZS1vdXQ7XG59XG5cbi52ZXgtdXNlci1tZW51LWl0ZW1fX2JhZGdlIHtcbiAgQGFwcGx5IHB4LTIgcHktMSByb3VuZGVkIGJnLXByaW1hcnktNjAwLzEwIHRleHQtcHJpbWFyeS02MDAgdGV4dC0yeHMgZm9udC1zZW1pYm9sZCBmbGV4LW5vbmU7XG59XG5cbi52ZXgtdXNlci1tZW51LWl0ZW1fX2ljb24ge1xuICBAYXBwbHkgZmxleC1ub25lIHRyYW5zaXRpb24gZHVyYXRpb24tMTAwIGVhc2Utb3V0O1xufVxuXG4udmV4LXVzZXItbWVudS1pdGVtX19kcm9wZG93bi1pY29uIHtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 46468:
/*!*****************************************************************!*\
  !*** ./src/app/layouts/components/sidenav/sidenav.component.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidenavComponent: () => (/* binding */ SidenavComponent)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 81891);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _sidenav_user_menu_sidenav_user_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidenav-user-menu/sidenav-user-menu.component */ 43569);
/* harmony import */ var _search_modal_search_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search-modal/search-modal.component */ 64914);
/* harmony import */ var _sidenav_item_sidenav_item_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidenav-item/sidenav-item.component */ 86463);
/* harmony import */ var _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/components/vex-scrollbar/vex-scrollbar.component */ 19844);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/navigation/navigation.service */ 20120);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @vex/config/vex-config.service */ 50376);
/* harmony import */ var _vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover.service */ 92371);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../core/services/auth.service */ 90304);




















function SidenavComponent_button_9_mat_icon_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "mat-icon", 17);
  }
}
function SidenavComponent_button_9_mat_icon_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "mat-icon", 18);
  }
}
function SidenavComponent_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SidenavComponent_button_9_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r6.toggleCollapse());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, SidenavComponent_button_9_mat_icon_1_Template, 1, 0, "mat-icon", 15)(2, SidenavComponent_button_9_mat_icon_2_Template, 1, 0, "mat-icon", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r0.collapsed);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r0.collapsed);
  }
}
function SidenavComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 19)(1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SidenavComponent_div_11_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r9);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r8.openSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](2, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, " Quick Search ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6, "Ctrl K");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
}
function SidenavComponent_vex_sidenav_item_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "vex-sidenav-item", 24);
  }
  if (rf & 2) {
    const item_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("item", item_r10)("level", 0);
  }
}
function SidenavComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 25)(1, "div", 26, 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SidenavComponent_div_21_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r13);
      const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](2);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r12.openProfileMenu(_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "img", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 29)(6, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](8, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](11, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](12, "mat-icon", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_1_0;
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("vex-sidenav-user--open", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 4, ctx_r3.userMenuOpen$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](((tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](8, 6, ctx_r3.currentUser$)) == null ? null : tmp_1_0.name) || "Usuario");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](((tmp_2_0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](11, 8, ctx_r3.currentUser$)) == null ? null : tmp_2_0.role_name) || "Rol no definido");
  }
}
class SidenavComponent {
  constructor(navigationService, layoutService, configService, popoverService, dialog, authService) {
    this.navigationService = navigationService;
    this.layoutService = layoutService;
    this.configService = configService;
    this.popoverService = popoverService;
    this.dialog = dialog;
    this.authService = authService;
    this.collapsed = false;
    this.collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
    this.title$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(config => config.sidenav.title));
    this.imageUrl$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(config => config.sidenav.imageUrl));
    this.showCollapsePin$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(config => config.sidenav.showCollapsePin));
    this.userVisible$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(config => config.sidenav.user.visible));
    this.searchVisible$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(config => config.sidenav.search.visible));
    this.userMenuOpen$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(false);
    this.currentUser$ = this.authService.currentUser$;
    this.items$ = this.navigationService.items$;
  }
  ngOnInit() {}
  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }
  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }
  toggleCollapse() {
    this.collapsed ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }
  trackByRoute(index, item) {
    if (item.type === 'link') {
      return item.route;
    }
    return item.label;
  }
  openProfileMenu(origin) {
    console.log('SidenavComponent: Abriendo menú de perfil...');
    try {
      const popoverRef = this.popoverService.open({
        content: _sidenav_user_menu_sidenav_user_menu_component__WEBPACK_IMPORTED_MODULE_0__.SidenavUserMenuComponent,
        origin,
        offsetY: -8,
        width: origin.clientWidth,
        position: [{
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        }]
      });
      this.userMenuOpen$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(popoverRef).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.switchMap)(ref => ref.afterClosed$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(() => false))), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.startWith)(true));
      console.log('SidenavComponent: Menú de perfil abierto correctamente');
    } catch (error) {
      console.error('SidenavComponent: Error al abrir menú de perfil:', error);
    }
  }
  openSearch() {
    this.dialog.open(_search_modal_search_modal_component__WEBPACK_IMPORTED_MODULE_1__.SearchModalComponent, {
      panelClass: 'vex-dialog-glossy',
      width: '100%',
      maxWidth: '600px'
    });
  }
  static #_ = this.ɵfac = function SidenavComponent_Factory(t) {
    return new (t || SidenavComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_4__.NavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_5__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_6__.VexConfigService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_7__.VexPopoverService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_14__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_8__.AuthService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: SidenavComponent,
    selectors: [["vex-sidenav"]],
    inputs: {
      collapsed: "collapsed"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵStandaloneFeature"]],
    decls: 23,
    vars: 28,
    consts: [[1, "vex-sidenav", "flex", "flex-col", 3, "mouseenter", "mouseleave"], [1, "vex-sidenav-toolbar__container"], [1, "sidenav-toolbar", "flex-none", "flex", "items-center"], ["alt", "Logo", 1, "w-10", "select-none", "flex-none", 3, "src"], [1, "vex-sidenav-toolbar__headline", "flex-auto"], ["class", "vex-sidenav-toolbar__collapse-toggle -mr-4 leading-none flex-none hidden lg:block", "mat-icon-button", "", "type", "button", 3, "click", 4, "ngIf"], ["class", "vex-sidenav-search__container", 4, "ngIf"], [1, "vex-sidenav-toolbar__divider"], [1, "flex-1", "flex", "flex-col"], [1, "pt-6", "flex-1"], [3, "item", "level", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "vex-sidenav-footer", "flex", "items-center", "justify-center", "opacity-20", "px-6", "py-6", "select-none", "flex-none"], ["alt", "Logo", 1, "w-12", "select-none", 3, "src"], ["class", "vex-sidenav-user__container flex-none", 4, "ngIf"], ["mat-icon-button", "", "type", "button", 1, "vex-sidenav-toolbar__collapse-toggle", "-mr-4", "leading-none", "flex-none", "hidden", "lg:block", 3, "click"], ["class", "icon-xs", "svgIcon", "mat:radio_button_checked", 4, "ngIf"], ["class", "icon-xs", "svgIcon", "mat:radio_button_unchecked", 4, "ngIf"], ["svgIcon", "mat:radio_button_checked", 1, "icon-xs"], ["svgIcon", "mat:radio_button_unchecked", 1, "icon-xs"], [1, "vex-sidenav-search__container"], ["matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", 1, "vex-sidenav-search", "relative", 3, "click"], ["svgIcon", "mat:search", 1, "flex-none", "vex-sidenav-search__icon"], [1, "flex-auto", "vex-sidenav-search__placeholder"], [1, "flex-none", "vex-sidenav-search__keybind"], [3, "item", "level"], [1, "vex-sidenav-user__container", "flex-none"], ["matRipple", "", "matRippleColor", "var(--vex-sidenav-item-ripple-color)", 1, "vex-sidenav-user", "flex", "items-center", 2, "cursor", "pointer", "user-select", "none", "padding", "12px", 3, "click"], ["userProfileMenuOriginRef", ""], ["alt", "User Avatar", "src", "../../../../assets/img/avatars/1.jpg", 1, "vex-sidenav-user__image", "flex-none"], [1, "vex-sidenav-user__content", "flex-auto"], [1, "vex-sidenav-user__title"], [1, "vex-sidenav-user__subtitle"], ["svgIcon", "mat:arrow_drop_down", 1, "vex-sidenav-user__dropdown-icon", "flex-none"]],
    template: function SidenavComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("mouseenter", function SidenavComponent_Template_div_mouseenter_0_listener() {
          return ctx.collapseOpenSidenav();
        })("mouseleave", function SidenavComponent_Template_div_mouseleave_0_listener() {
          return ctx.collapseCloseSidenav();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](1, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "div", 1)(3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "h2", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](8, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](9, SidenavComponent_button_9_Template, 3, 2, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](10, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](11, SidenavComponent_div_11_Template, 7, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](12, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](13, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "vex-scrollbar", 8)(15, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](16, SidenavComponent_vex_sidenav_item_16_Template, 1, 2, "vex-sidenav-item", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](17, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](19, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](20, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, SidenavComponent_div_21_Template, 13, 10, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](22, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("collapsed", ctx.collapsed)("open", ctx.collapsed && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](1, 12, ctx.collapsedOpen$));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 14, ctx.imageUrl$), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](8, 16, ctx.title$), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](10, 18, ctx.showCollapsePin$));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](12, 20, ctx.searchVisible$));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](17, 22, ctx.items$))("ngForTrackBy", ctx.trackByRoute);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](20, 24, ctx.imageUrl$), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](22, 26, ctx.userVisible$));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_15__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__.MatIcon, _angular_material_core__WEBPACK_IMPORTED_MODULE_18__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_18__.MatRipple, _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_3__.VexScrollbarComponent, _angular_common__WEBPACK_IMPORTED_MODULE_15__.NgFor, _sidenav_item_sidenav_item_component__WEBPACK_IMPORTED_MODULE_2__.SidenavItemComponent, _angular_common__WEBPACK_IMPORTED_MODULE_15__.AsyncPipe],
    styles: [".vex-sidenav[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-background);\n  color: var(--vex-sidenav-color);\n  height: 100%;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n  width: var(--vex-sidenav-width);\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%] {\n  width: var(--vex-sidenav-collapsed-width);\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)   .vex-sidenav-toolbar__headline[_ngcontent-%COMP%], .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)   .vex-sidenav-toolbar__collapse-toggle[_ngcontent-%COMP%] {\n  opacity: 0;\n  padding-inline-start: var(--vex-sidenav-item-padding-horizontal);\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-item__icon {\n  margin-inline-end: var(--vex-sidenav-item-padding-horizontal);\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-subheading, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-item__badge, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-item__label, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-user__title, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-user__subtitle, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-user__dropdown-icon, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-search__placeholder, .vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-search__keybind {\n  opacity: 0;\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .vex-sidenav-user {\n  padding-right: 0.625rem;\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]:not(.open)     .simplebar-track.simplebar-vertical {\n  visibility: hidden !important;\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]     .vex-sidenav-subheading, .vex-sidenav.collapsed[_ngcontent-%COMP%]     .vex-sidenav-item__label {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.vex-sidenav.collapsed[_ngcontent-%COMP%]     .vex-sidenav-item__badge {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.vex-sidenav.collapsed.open[_ngcontent-%COMP%] {\n  width: var(--vex-sidenav-width);\n}\n.vex-sidenav.collapsed.open[_ngcontent-%COMP%]   .vex-sidenav-toolbar__collapse-toggle[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.vex-sidenav.collapsed.open[_ngcontent-%COMP%]     .vex-sidenav-item__badge {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.vex-sidenav[_ngcontent-%COMP%]     .simplebar-track.simplebar-horizontal {\n  visibility: hidden !important;\n}\n\n\n\n.vex-sidenav-toolbar__container[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-background);\n  position: sticky;\n  top: 0px;\n  z-index: 10;\n}\n\n.sidenav-toolbar[_ngcontent-%COMP%] {\n  align-items: center;\n  background: var(--vex-sidenav-toolbar-background);\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: row;\n  height: var(--vex-toolbar-height);\n  white-space: nowrap;\n  width: 100%;\n  padding-top: 0px;\n  padding-bottom: 0px;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n\n.vex-sidenav-toolbar__headline[_ngcontent-%COMP%] {\n  -webkit-user-select: none;\n          user-select: none;\n  font-size: 1.5rem;\n  line-height: 2rem;\n  font-weight: 700;\n  letter-spacing: 0.025em;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n  padding-inline-start: var(--vex-sidenav-item-icon-gap);\n}\n\n.vex-sidenav-toolbar__collapse-toggle[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n\n.vex-sidenav-toolbar__divider[_ngcontent-%COMP%] {\n  height: 1px;\n  background: var(--vex-sidenav-section-divider-color);\n}\n\n\n\n.vex-sidenav-user__container[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-toolbar-background);\n  border-color: var(--vex-sidenav-section-divider-color);\n  position: sticky;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-top-width: 1px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n.vex-sidenav-user[_ngcontent-%COMP%] {\n  position: relative;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--vex-border-radius);\n  padding: 0.375rem;\n  padding-top: 0.5rem;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n.vex-sidenav-user[_ngcontent-%COMP%]:hover {\n  background-color: rgb(255 255 255 / 0.1);\n}\n\n.vex-sidenav-user__image[_ngcontent-%COMP%] {\n  display: block;\n  height: 2.25rem;\n  width: 2.25rem;\n  border-radius: 9999px;\n}\n\n.vex-sidenav-user__content[_ngcontent-%COMP%] {\n  padding-left: 0.75rem;\n}\n\n.vex-sidenav-user__title[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n.vex-sidenav-user__subtitle[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 500;\n  color: rgb(255 255 255 / 0.5);\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n.vex-sidenav-user__dropdown-icon[_ngcontent-%COMP%] {\n  color: rgb(255 255 255 / 0.5);\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n.vex-sidenav-user--open[_ngcontent-%COMP%] {\n  background-color: rgb(255 255 255 / 0.1);\n}\n\n\n\n.vex-sidenav-search__container[_ngcontent-%COMP%] {\n  background: var(--vex-sidenav-toolbar-background);\n  z-index: 10;\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n.vex-sidenav-search[_ngcontent-%COMP%] {\n  display: flex;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  align-items: center;\n  border-radius: var(--vex-border-radius);\n  background-color: rgb(255 255 255 / 0.1);\n  padding: 0.25rem;\n  padding-left: 0.75rem;\n  color: rgb(255 255 255 / 0.3);\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n.vex-sidenav-search[_ngcontent-%COMP%]:hover {\n  background-color: rgb(255 255 255 / 0.2);\n  color: rgb(255 255 255 / 0.6);\n}\n\n.vex-sidenav-search__icon[_ngcontent-%COMP%], .vex-sidenav-search__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  height: 1.25rem;\n  width: 1.25rem;\n  line-height: 1.25rem;\n}\n\n.vex-sidenav-search__icon[_ngcontent-%COMP%] {\n  width: var(--vex-sidenav-item-icon-size);\n}\n\n.vex-sidenav-search__placeholder[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 500;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  margin-left: var(--vex-sidenav-item-icon-gap);\n}\n\n.vex-sidenav-search__keybind[_ngcontent-%COMP%] {\n  border-radius: var(--vex-border-radius);\n  background-color: rgb(255 255 255 / 0.1);\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  font-size: 0.625rem;\n  font-weight: 600;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3NpZGVuYXYvc2lkZW5hdi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHlDQUFBO0VBQ0EsK0JBQUE7RUFDQSxZQUFBO0VBQ0Esd0JBQUE7RUFBQSx3REFBQTtFQUFBLDBCQUFBO0VBQUEsNERBQUE7RUFDQSwrQkFBQTtBQUNGO0FBQ0U7RUFDRSx5Q0FBQTtBQUNKO0FBRU07O0VBRUUsVUFBQTtFQUNBLGdFQUFBO0FBQVI7QUFJUTtFQUNFLDZEQUFBO0FBRlY7QUFLUTs7Ozs7Ozs7RUFRRSxVQUFBO0FBSFY7QUFPVTtFQUFBO0FBQUE7QUFHRjtFQUNFLDZCQUFBO0FBTFY7QUFhUTs7RUFBQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQTtBQUFBO0FBSUE7RUFBQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQTtBQUFBO0FBSUo7RUFDRSwrQkFBQTtBQVpOO0FBZVE7RUFBQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQTtBQUFBO0FBS0U7RUFBQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQTtBQUFBO0FBT047RUFDRSw2QkFBQTtBQW5CTjs7QUF3QkEscUJBQUE7QUFDQTtFQUNFLHlDQUFBO0VBRUEsZ0JBQUE7RUFBQSxRQUFBO0VBQUEsV0FBQTtBQXRCRjs7QUF5QkE7RUFDRSxtQkFBQTtFQUNBLGlEQUFBO0VBQ0Esc0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBQUEsbUJBQUE7RUFBQSxvQkFBQTtFQUFBLHFCQUFBO0FBdEJGOztBQTBCRTtFQUFBLHlCQUFBO1VBQUEsaUJBQUE7RUFBQSxpQkFBQTtFQUFBLGlCQUFBO0VBQUEsZ0JBQUE7RUFBQSx1QkFBQTtFQUFBLHdCQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBLDREQUFBO0VBQ0E7QUFEQTs7QUFLQTtFQUFBLHdCQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBO0FBQUE7O0FBR0Y7RUFDRSxXQUFBO0VBQ0Esb0RBQUE7QUF0QkY7O0FBeUJBLHNCQUFBO0FBQ0E7RUFDRSxpREFBQTtFQUNBLHNEQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFFQSxxQkFBQTtFQUFBLG9CQUFBO0VBQUEscUJBQUE7RUFBQSxvQkFBQTtFQUFBLHVCQUFBO0FBdkJGOztBQTJCRTtFQUFBLGtCQUFBO0VBQUEsZUFBQTtFQUFBLHlCQUFBO1VBQUEsaUJBQUE7RUFBQSx1Q0FBQTtFQUFBLGlCQUFBO0VBQUEsbUJBQUE7RUFBQSx3QkFBQTtFQUFBLHdEQUFBO0VBQUEsMEJBQUE7RUFBQTtBQUFBOztBQUFBO0VBQUE7QUFBQTs7QUFJQTtFQUFBLGNBQUE7RUFBQSxlQUFBO0VBQUEsY0FBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQTtBQUFBOztBQUlBO0VBQUEsbUJBQUE7RUFBQSxtQkFBQTtFQUFBLG9CQUFBO0VBQUEsZ0JBQUE7RUFBQSxnS0FBQTtFQUFBLHdKQUFBO0VBQUEsaUxBQUE7RUFBQSx3REFBQTtFQUFBLDBCQUFBO0VBQUE7QUFBQTs7QUFJQTtFQUFBLG1CQUFBO0VBQUEsa0JBQUE7RUFBQSxpQkFBQTtFQUFBLGdCQUFBO0VBQUEsNkJBQUE7RUFBQSxnS0FBQTtFQUFBLHdKQUFBO0VBQUEsaUxBQUE7RUFBQSx3REFBQTtFQUFBLDBCQUFBO0VBQUE7QUFBQTs7QUFJQTtFQUFBLDZCQUFBO0VBQUEsZ0tBQUE7RUFBQSx3SkFBQTtFQUFBLGlMQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQTtBQUFBOztBQUdGLHdCQUFBO0FBQ0E7RUFDRSxpREFBQTtFQUNBLFdBQUE7RUFBQSxxQkFBQTtFQUFBLHNCQUFBO0VBQUEsdUJBQUE7QUF2QkY7O0FBMkJFO0VBQUEsYUFBQTtFQUFBLGVBQUE7RUFBQSx5QkFBQTtVQUFBLGlCQUFBO0VBQUEsbUJBQUE7RUFBQSx1Q0FBQTtFQUFBLHdDQUFBO0VBQUEsZ0JBQUE7RUFBQSxxQkFBQTtFQUFBLDZCQUFBO0VBQUEsZ0tBQUE7RUFBQSx3SkFBQTtFQUFBLGlMQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBO0FBQUE7O0FBQUE7RUFBQSx3Q0FBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQSxrQkFBQTtFQUFBLGVBQUE7RUFBQSxjQUFBO0VBQUE7QUFBQTs7QUFERjtFQUVFLHdDQUFBO0FBdkJGOztBQTJCRTtFQUFBLG1CQUFBO0VBQUEsa0JBQUE7RUFBQSxpQkFBQTtFQUFBLGdCQUFBO0VBQUEsZ0tBQUE7RUFBQSx3SkFBQTtFQUFBLGlMQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBLHNEQUFBO0VBQ0E7QUFEQTs7QUFLQTtFQUFBLHVDQUFBO0VBQUEsd0NBQUE7RUFBQSxvQkFBQTtFQUFBLHFCQUFBO0VBQUEsb0JBQUE7RUFBQSx1QkFBQTtFQUFBLG1CQUFBO0VBQUEsZ0JBQUE7RUFBQSxnS0FBQTtFQUFBLHdKQUFBO0VBQUEsaUxBQUE7RUFBQSx3REFBQTtFQUFBLDBCQUFBO0VBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi52ZXgtc2lkZW5hdiB7XG4gIGJhY2tncm91bmQ6IHZhcigtLXZleC1zaWRlbmF2LWJhY2tncm91bmQpO1xuICBjb2xvcjogdmFyKC0tdmV4LXNpZGVuYXYtY29sb3IpO1xuICBoZWlnaHQ6IDEwMCU7XG4gIEBhcHBseSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi00MDAgZWFzZS1vdXQtc3dpZnQ7XG4gIHdpZHRoOiB2YXIoLS12ZXgtc2lkZW5hdi13aWR0aCk7XG5cbiAgJi5jb2xsYXBzZWQge1xuICAgIHdpZHRoOiB2YXIoLS12ZXgtc2lkZW5hdi1jb2xsYXBzZWQtd2lkdGgpO1xuXG4gICAgJjpub3QoLm9wZW4pIHtcbiAgICAgIC52ZXgtc2lkZW5hdi10b29sYmFyX19oZWFkbGluZSxcbiAgICAgIC52ZXgtc2lkZW5hdi10b29sYmFyX19jb2xsYXBzZS10b2dnbGUge1xuICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICBwYWRkaW5nLWlubGluZS1zdGFydDogdmFyKC0tdmV4LXNpZGVuYXYtaXRlbS1wYWRkaW5nLWhvcml6b250YWwpO1xuICAgICAgfVxuXG4gICAgICA6Om5nLWRlZXAge1xuICAgICAgICAudmV4LXNpZGVuYXYtaXRlbV9faWNvbiB7XG4gICAgICAgICAgbWFyZ2luLWlubGluZS1lbmQ6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0tcGFkZGluZy1ob3Jpem9udGFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC52ZXgtc2lkZW5hdi1zdWJoZWFkaW5nLFxuICAgICAgICAudmV4LXNpZGVuYXYtaXRlbV9fYmFkZ2UsXG4gICAgICAgIC52ZXgtc2lkZW5hdi1pdGVtX19sYWJlbCxcbiAgICAgICAgLnZleC1zaWRlbmF2LXVzZXJfX3RpdGxlLFxuICAgICAgICAudmV4LXNpZGVuYXYtdXNlcl9fc3VidGl0bGUsXG4gICAgICAgIC52ZXgtc2lkZW5hdi11c2VyX19kcm9wZG93bi1pY29uLFxuICAgICAgICAudmV4LXNpZGVuYXYtc2VhcmNoX19wbGFjZWhvbGRlcixcbiAgICAgICAgLnZleC1zaWRlbmF2LXNlYXJjaF9fa2V5YmluZCB7XG4gICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52ZXgtc2lkZW5hdi11c2VyIHtcbiAgICAgICAgICBAYXBwbHkgcHItMi41O1xuICAgICAgICB9XG5cbiAgICAgICAgLnNpbXBsZWJhci10cmFjay5zaW1wbGViYXItdmVydGljYWwge1xuICAgICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgOjpuZy1kZWVwIHtcbiAgICAgIC52ZXgtc2lkZW5hdi1zdWJoZWFkaW5nLFxuICAgICAgLnZleC1zaWRlbmF2LWl0ZW1fX2xhYmVsIHtcbiAgICAgICAgQGFwcGx5IHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTQwMCBlYXNlLW91dC1zd2lmdDtcbiAgICAgIH1cblxuICAgICAgLnZleC1zaWRlbmF2LWl0ZW1fX2JhZGdlIHtcbiAgICAgICAgQGFwcGx5IHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMCBlYXNlLW91dC1zd2lmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmLm9wZW4ge1xuICAgICAgd2lkdGg6IHZhcigtLXZleC1zaWRlbmF2LXdpZHRoKTtcblxuICAgICAgLnZleC1zaWRlbmF2LXRvb2xiYXJfX2NvbGxhcHNlLXRvZ2dsZSB7XG4gICAgICAgIEBhcHBseSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi00MDAgZWFzZS1vdXQtc3dpZnQ7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcCB7XG4gICAgICAgIC52ZXgtc2lkZW5hdi1pdGVtX19iYWRnZSB7XG4gICAgICAgICAgQGFwcGx5IHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTQwMCBlYXNlLW91dC1zd2lmdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIDo6bmctZGVlcCB7XG4gICAgLnNpbXBsZWJhci10cmFjay5zaW1wbGViYXItaG9yaXpvbnRhbCB7XG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIFNJREVOQVYgVE9PTEJBUiAqL1xuLnZleC1zaWRlbmF2LXRvb2xiYXJfX2NvbnRhaW5lciB7XG4gIGJhY2tncm91bmQ6IHZhcigtLXZleC1zaWRlbmF2LWJhY2tncm91bmQpO1xuXG4gIEBhcHBseSBzdGlja3kgdG9wLTAgei0xMDtcbn1cblxuLnNpZGVuYXYtdG9vbGJhciB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQ6IHZhcigtLXZleC1zaWRlbmF2LXRvb2xiYXItYmFja2dyb3VuZCk7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGhlaWdodDogdmFyKC0tdmV4LXRvb2xiYXItaGVpZ2h0KTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgd2lkdGg6IDEwMCU7XG4gIEBhcHBseSBweS0wIHB4LTY7XG59XG5cbi52ZXgtc2lkZW5hdi10b29sYmFyX19oZWFkbGluZSB7XG4gIEBhcHBseSB0ZXh0LTJ4bCBmb250LWJvbGQgdHJhY2tpbmctd2lkZSBzZWxlY3Qtbm9uZSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi00MDAgZWFzZS1vdXQtc3dpZnQ7XG4gIHBhZGRpbmctaW5saW5lLXN0YXJ0OiB2YXIoLS12ZXgtc2lkZW5hdi1pdGVtLWljb24tZ2FwKTtcbn1cblxuLnZleC1zaWRlbmF2LXRvb2xiYXJfX2NvbGxhcHNlLXRvZ2dsZSB7XG4gIEBhcHBseSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDAgZWFzZS1vdXQtc3dpZnQ7XG59XG5cbi52ZXgtc2lkZW5hdi10b29sYmFyX19kaXZpZGVyIHtcbiAgaGVpZ2h0OiAxcHg7XG4gIGJhY2tncm91bmQ6IHZhcigtLXZleC1zaWRlbmF2LXNlY3Rpb24tZGl2aWRlci1jb2xvcik7XG59XG5cbi8qKiBWRVggU0lERU5BViBVU0VSICovXG4udmV4LXNpZGVuYXYtdXNlcl9fY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tdmV4LXNpZGVuYXYtdG9vbGJhci1iYWNrZ3JvdW5kKTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS12ZXgtc2lkZW5hdi1zZWN0aW9uLWRpdmlkZXItY29sb3IpO1xuICBwb3NpdGlvbjogc3RpY2t5O1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuXG4gIEBhcHBseSBib3JkZXItdCBweC0yIHB5LTM7XG59XG5cbi52ZXgtc2lkZW5hdi11c2VyIHtcbiAgQGFwcGx5IHJlbGF0aXZlIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCBlYXNlLW91dCByb3VuZGVkIGhvdmVyOmJnLXdoaXRlLzEwIHNlbGVjdC1ub25lIGN1cnNvci1wb2ludGVyIHAtMS41IHB0LTI7XG59XG5cbi52ZXgtc2lkZW5hdi11c2VyX19pbWFnZSB7XG4gIEBhcHBseSB3LTkgaC05IGJsb2NrIHJvdW5kZWQtZnVsbDtcbn1cblxuLnZleC1zaWRlbmF2LXVzZXJfX2NvbnRlbnQge1xuICBAYXBwbHkgcGwtMztcbn1cblxuLnZleC1zaWRlbmF2LXVzZXJfX3RpdGxlIHtcbiAgQGFwcGx5IHRleHQtc20gZm9udC1tZWRpdW0gd2hpdGVzcGFjZS1ub3dyYXAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgZWFzZS1vdXQ7XG59XG5cbi52ZXgtc2lkZW5hdi11c2VyX19zdWJ0aXRsZSB7XG4gIEBhcHBseSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUvNTAgd2hpdGVzcGFjZS1ub3dyYXAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgZWFzZS1vdXQ7XG59XG5cbi52ZXgtc2lkZW5hdi11c2VyX19kcm9wZG93bi1pY29uIHtcbiAgQGFwcGx5IHRleHQtd2hpdGUvNTAgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgZWFzZS1vdXQ7XG59XG5cbi52ZXgtc2lkZW5hdi11c2VyLS1vcGVuIHtcbiAgQGFwcGx5IGJnLXdoaXRlLzEwO1xufVxuXG4vKiogVkVYIFNJREVOQVYgU0VBUkNIICovXG4udmV4LXNpZGVuYXYtc2VhcmNoX19jb250YWluZXIge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtc2lkZW5hdi10b29sYmFyLWJhY2tncm91bmQpO1xuICBAYXBwbHkgcHgtMyBwYi0zIHotMTA7XG59XG5cbi52ZXgtc2lkZW5hdi1zZWFyY2gge1xuICBAYXBwbHkgcm91bmRlZCBiZy13aGl0ZS8xMCB0ZXh0LXdoaXRlLzMwIGhvdmVyOmJnLXdoaXRlLzIwIGhvdmVyOnRleHQtd2hpdGUvNjAgY3Vyc29yLXBvaW50ZXIgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgZWFzZS1vdXQgZmxleCBpdGVtcy1jZW50ZXIgc2VsZWN0LW5vbmUgcC0xIHBsLTM7XG59XG5cbi52ZXgtc2lkZW5hdi1zZWFyY2hfX2ljb24ge1xuICBAYXBwbHkgaWNvbi1zbTtcbiAgd2lkdGg6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1zaXplKTtcbn1cblxuLnZleC1zaWRlbmF2LXNlYXJjaF9fcGxhY2Vob2xkZXIge1xuICBAYXBwbHkgdGV4dC14cyBmb250LW1lZGl1bSB3aGl0ZXNwYWNlLW5vd3JhcCB0cmFuc2l0aW9uIGR1cmF0aW9uLTMwMCBlYXNlLW91dDtcbiAgbWFyZ2luLWxlZnQ6IHZhcigtLXZleC1zaWRlbmF2LWl0ZW0taWNvbi1nYXApO1xufVxuXG4udmV4LXNpZGVuYXYtc2VhcmNoX19rZXliaW5kIHtcbiAgQGFwcGx5IGJnLXdoaXRlLzEwIHJvdW5kZWQgdGV4dC0yeHMgcHgtMiBweS0xIGZvbnQtc2VtaWJvbGQgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgZWFzZS1vdXQ7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 62276:
/*!*****************************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/mega-menu/mega-menu.component.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MegaMenuComponent: () => (/* binding */ MegaMenuComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_components_vex_popover_vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover-ref */ 95925);








function MegaMenuComponent_a_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MegaMenuComponent_a_14_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r3.close());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const feature_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", feature_r2.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("svgIcon", feature_r2.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](feature_r2.label);
  }
}
function MegaMenuComponent_a_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MegaMenuComponent_a_19_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r6.close());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const page_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", page_r5.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](page_r5.label);
  }
}
class MegaMenuComponent {
  constructor(popoverRef) {
    this.popoverRef = popoverRef;
    this.features = [{
      icon: 'mat:layers',
      label: 'Dashboard',
      route: '/'
    }, {
      icon: 'mat:assignment',
      label: 'AIO-Table',
      route: '/apps/aio-table'
    }, {
      icon: 'mat:contact_support',
      label: 'Help Center',
      route: '/apps/help-center'
    }, {
      icon: 'mat:contacts',
      label: 'Contacts',
      route: '/apps/contacts/grid'
    }, {
      icon: 'mat:assessment',
      label: 'Scrumboard',
      route: '/apps/scrumboard/1'
    }, {
      icon: 'mat:book',
      label: 'Documentation',
      route: '/documentation'
    }];
    this.pages = [{
      label: 'All-In-One Table',
      route: '/apps/aio-table'
    }, {
      label: 'Authentication',
      route: '/login'
    }, {
      label: 'Components',
      route: '/ui/components/overview'
    }, {
      label: 'Documentation',
      route: '/documentation'
    }, {
      label: 'FAQ',
      route: '/pages/faq'
    }, {
      label: 'Form Elements',
      route: '/ui/forms/form-elements'
    }, {
      label: 'Form Wizard',
      route: '/ui/forms/form-wizard'
    }, {
      label: 'Guides',
      route: '/pages/guides'
    }, {
      label: 'Help Center',
      route: '/apps/help-center'
    }, {
      label: 'Scrumboard',
      route: '/apps/scrumboard'
    }];
  }
  ngOnInit() {}
  close() {
    this.popoverRef.close();
  }
  static #_ = this.ɵfac = function MegaMenuComponent_Factory(t) {
    return new (t || MegaMenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_ref__WEBPACK_IMPORTED_MODULE_0__.VexPopoverRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: MegaMenuComponent,
    selectors: [["vex-mega-menu"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 20,
    vars: 2,
    consts: [[1, "card", "overflow-auto", "flex", "flex-col", "md:flex-row", "sm:mr-6"], [1, "bg-primary-600/10", "p-6", "flex-auto", "max-w-[300px]"], [1, "headline", "mb-4", "text-primary-600"], [1, "caption"], ["color", "primary", "mat-flat-button", "", "type", "button", 1, "mt-4", "w-full"], [1, "p-6", "flex-auto", "max-w-[400px]"], [1, "body-2", "m-0"], [1, "mt-4", "grid", "grid-cols-3"], ["class", "text-dark p-3 text-center hover:bg-primary-600/10 hover:text-primary-600 transition duration-400 ease-out-swift rounded block no-underline", 3, "routerLink", "click", 4, "ngFor", "ngForOf"], [1, "p-6", "flex-auto", "max-w-[350px]"], [1, "mt-6", "grid", "grid-cols-2", "gap-x-12", "gap-y-4"], ["class", "text-dark body-1 no-underline hover:text-primary-600 transition duration-400 ease-out-swift", 3, "routerLink", "click", 4, "ngFor", "ngForOf"], [1, "text-dark", "p-3", "text-center", "hover:bg-primary-600/10", "hover:text-primary-600", "transition", "duration-400", "ease-out-swift", "rounded", "block", "no-underline", 3, "routerLink", "click"], ["color", "primary", 1, "icon-xl", 3, "svgIcon"], [1, "body-2", "mt-2"], [1, "text-dark", "body-1", "no-underline", "hover:text-primary-600", "transition", "duration-400", "ease-out-swift", 3, "routerLink", "click"]],
    template: function MegaMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Mega Menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, " Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " Learn More ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 5)(11, "h3", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Features");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, MegaMenuComponent_a_14_Template, 4, 3, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 9)(16, "h3", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "Pages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, MegaMenuComponent_a_19_Template, 2, 2, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.features);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.pages);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgFor, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon],
    encapsulation: 2
  });
}

/***/ }),

/***/ 6182:
/*!***********************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/search/search.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchComponent: () => (/* binding */ SearchComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 60839);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _search_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search.service */ 63925);













const _c0 = ["searchInput"];
function SearchComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SearchComponent_div_8_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r2.close());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class SearchComponent {
  constructor(layoutService, searchService) {
    this.layoutService = layoutService;
    this.searchService = searchService;
    this.show$ = this.layoutService.searchOpen$;
    this.searchCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.UntypedFormControl();
    this.destroyRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_2__.DestroyRef);
  }
  ngOnInit() {
    this.searchService.isOpenSubject.next(true);
    this.searchCtrl.valueChanges.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__.takeUntilDestroyed)(this.destroyRef)).subscribe(value => this.searchService.valueChangesSubject.next(value));
    this.show$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.filter)(show => show), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__.takeUntilDestroyed)(this.destroyRef)).subscribe(() => this.input?.nativeElement.focus());
  }
  close() {
    this.layoutService.closeSearch();
    this.searchCtrl.setValue(undefined);
    this.searchService.isOpenSubject.next(false);
  }
  search() {
    this.searchService.submitSubject.next(this.searchCtrl.value);
    this.close();
  }
  ngOnDestroy() {
    this.layoutService.closeSearch();
    this.searchCtrl.setValue(undefined);
    this.searchService.isOpenSubject.next(false);
  }
  static #_ = this.ɵfac = function SearchComponent_Factory(t) {
    return new (t || SearchComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_0__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_search_service__WEBPACK_IMPORTED_MODULE_1__.SearchService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: SearchComponent,
    selectors: [["vex-search"]],
    viewQuery: function SearchComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 7);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.input = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 10,
    vars: 8,
    consts: [[1, "search", 3, "keyup.escape"], ["color", "primary", "mat-icon-button", "", "type", "button", 1, "ltr:right-12", "rtl:left-12", "top-12", "absolute", 3, "click"], ["svgIcon", "mat:close"], ["placeholder", "Search...", 1, "search-input", 3, "formControl", "keyup.enter"], ["searchInput", ""], [1, "search-hint"], ["class", "search-overlay", 3, "click", 4, "ngIf"], [1, "search-overlay", 3, "click"]],
    template: function SearchComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("keyup.escape", function SearchComponent_Template_div_keyup_escape_0_listener() {
          return ctx.close();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SearchComponent_Template_button_click_2_listener() {
          return ctx.close();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("keyup.enter", function SearchComponent_Template_input_keyup_enter_4_listener() {
          return ctx.search();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Hit enter to search");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, SearchComponent_div_8_Template, 1, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](9, "async");
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("show", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 4, ctx.show$));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formControl", ctx.searchCtrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](9, 6, ctx.show$));
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlDirective, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.AsyncPipe],
    styles: [".search[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  display: flex;\n  width: 100%;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  opacity: 0;\n  height: 50vh;\n  pointer-events: none;\n  transform: scale(0.75);\n  transition: all 0.25s cubic-bezier(0.2, 1, 0.3, 1);\n  z-index: 1050;\n}\n.search.show[_ngcontent-%COMP%] {\n  opacity: 1;\n  pointer-events: auto;\n  transform: scale(1);\n  transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);\n}\n\n.search-input[_ngcontent-%COMP%] {\n  font-size: 7vw;\n  line-height: 3rem;\n  width: 75%;\n  margin: 0px;\n  border-radius: 0px;\n  border-bottom-width: 1px;\n  border-right-width: 0px;\n  border-left-width: 0px;\n  border-top-width: 0px;\n  background-color: transparent;\n  font-weight: 700;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n\n.search-hint[_ngcontent-%COMP%] {\n  width: 75%;\n  margin-left: auto;\n  margin-right: auto;\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  text-align: right;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  font-weight: 700;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-hint-text-rgb) / var(--tw-text-opacity));\n}\n\n.search-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 0px;\n  left: 0px;\n  width: 100%;\n  opacity: 0;\n  height: 50vh;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3Rvb2xiYXIvc2VhcmNoL3NlYXJjaC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTtFQUFBLGVBQUE7RUFBQSxRQUFBO0VBQUEsU0FBQTtFQUFBLGFBQUE7RUFBQSxXQUFBO0VBQUEsc0JBQUE7RUFBQSxtQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFBQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxrREFBQTtFQUNBO0FBTEE7QUFPQTtFQUNFLFVBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsaURBQUE7QUFDSjs7QUFHQTtFQUNFLGNBQUE7RUFDQSxpQkFBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0VBQUEsa0JBQUE7RUFBQSx3QkFBQTtFQUFBLHVCQUFBO0VBQUEsc0JBQUE7RUFBQSxxQkFBQTtFQUFBLDZCQUFBO0VBQUEsZ0JBQUE7QUFBRjtBQUVFO0VBQ0UsYUFBQTtBQUFKOztBQUlBO0VBQ0UsVUFBQTtFQUNBLGlCQUFBO0VBQUEsa0JBQUE7RUFBQSxpQkFBQTtFQUFBLG9CQUFBO0VBQUEsaUJBQUE7RUFBQSxlQUFBO0VBQUEsbUJBQUE7RUFBQSxnQkFBQTtFQUFBLG9CQUFBO0VBQUEsd0VBQUE7QUFERjs7QUFLRTtFQUFBLGVBQUE7RUFBQSxXQUFBO0VBQUEsU0FBQTtFQUFBLFdBQUE7RUFBQSxVQUFBO0VBQ0E7QUFEQSIsInNvdXJjZXNDb250ZW50IjpbIi5zZWFyY2gge1xuICBAYXBwbHkgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1jZW50ZXIgZml4ZWQgdG9wLTAgbGVmdC0wIHctZnVsbCBvcGFjaXR5LTA7XG4gIGhlaWdodDogNTB2aDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC43NSk7XG4gIHRyYW5zaXRpb246IGFsbCAwLjI1cyBjdWJpYy1iZXppZXIoMC4yLCAxLCAwLjMsIDEpO1xuICB6LWluZGV4OiAxMDUwO1xuXG4gICYuc2hvdyB7XG4gICAgb3BhY2l0eTogMTtcbiAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjVzIGN1YmljLWJlemllcigwLjIsIDEsIDAuMywgMSk7XG4gIH1cbn1cblxuLnNlYXJjaC1pbnB1dCB7XG4gIGZvbnQtc2l6ZTogN3Z3O1xuICBsaW5lLWhlaWdodDogM3JlbTtcbiAgd2lkdGg6IDc1JTtcbiAgQGFwcGx5IGJvcmRlci1iIG0tMCByb3VuZGVkLW5vbmUgYm9yZGVyLXItMCBib3JkZXItbC0wIGJvcmRlci10LTAgZm9udC1ib2xkIGJnLXRyYW5zcGFyZW50O1xuXG4gICY6Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cbn1cblxuLnNlYXJjaC1oaW50IHtcbiAgd2lkdGg6IDc1JTtcbiAgQGFwcGx5IHRleHQtYmFzZSB0ZXh0LXJpZ2h0IHB5LTQgbXgtYXV0byB0ZXh0LWhpbnQgZm9udC1ib2xkO1xufVxuXG4uc2VhcmNoLW92ZXJsYXkge1xuICBAYXBwbHkgZml4ZWQgdy1mdWxsIGJvdHRvbS0wIGxlZnQtMCBvcGFjaXR5LTA7XG4gIGhlaWdodDogNTB2aDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 63925:
/*!*********************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/search/search.service.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchService: () => (/* binding */ SearchService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);


class SearchService {
  constructor() {
    this.valueChangesSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject('');
    this.valueChanges$ = this.valueChangesSubject.asObservable();
    this.submitSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.submit$ = this.submitSubject.asObservable();
    this.isOpenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.isOpen$ = this.isOpenSubject.asObservable();
  }
  static #_ = this.ɵfac = function SearchService_Factory(t) {
    return new (t || SearchService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: SearchService,
    factory: SearchService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 41951:
/*!*********************************************************************************************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/toolbar-notifications/toolbar-notifications-dropdown/toolbar-notifications-dropdown.component.ts ***!
  \*********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToolbarNotificationsDropdownComponent: () => (/* binding */ ToolbarNotificationsDropdownComponent)
/* harmony export */ });
/* harmony import */ var luxon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! luxon */ 17765);
/* harmony import */ var _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/utils/track-by */ 47637);
/* harmony import */ var _vex_pipes_vex_date_format_relative_vex_date_format_relative_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/pipes/vex-date-format-relative/vex-date-format-relative.pipe */ 41031);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);














const _c0 = () => [];
function ToolbarNotificationsDropdownComponent_a_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-icon", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 17)(3, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](7, "vexDateFormatRelative");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "mat-icon", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const notification_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("read", notification_r2.read);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](9, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", notification_r2.colorClass)("svgIcon", notification_r2.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](notification_r2.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](7, 7, notification_r2.datetime), " ");
  }
}
class ToolbarNotificationsDropdownComponent {
  constructor() {
    this.notifications = [{
      id: '1',
      label: 'New Order Received',
      icon: 'mat:shopping_basket',
      colorClass: 'text-primary-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 1
      })
    }, {
      id: '2',
      label: 'New customer has registered',
      icon: 'mat:account_circle',
      colorClass: 'text-orange-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 2
      })
    }, {
      id: '3',
      label: 'Campaign statistics are available',
      icon: 'mat:insert_chart',
      colorClass: 'text-purple-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 5
      })
    }, {
      id: '4',
      label: 'Project has been approved',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 9
      })
    }, {
      id: '5',
      label: 'Client reports are available',
      icon: 'mat:description',
      colorClass: 'text-primary-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 30
      })
    }, {
      id: '6',
      label: 'New review received',
      icon: 'mat:feedback',
      colorClass: 'text-orange-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 40
      }),
      read: true
    }, {
      id: '7',
      label: '22 verified registrations',
      icon: 'mat:verified_user',
      colorClass: 'text-green-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 60
      })
    }, {
      id: '8',
      label: 'New files available',
      icon: 'mat:file_copy',
      colorClass: 'text-amber-600',
      datetime: luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.local().minus({
        hour: 90
      })
    }];
    this.trackById = _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_1__.trackById;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ToolbarNotificationsDropdownComponent_Factory(t) {
    return new (t || ToolbarNotificationsDropdownComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: ToolbarNotificationsDropdownComponent,
    selectors: [["vex-toolbar-notifications-dropdown"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 24,
    vars: 4,
    consts: [[1, "dropdown"], [1, "dropdown-header", "flex", "items-center", "justify-between"], [1, "dropdown-heading"], [1, "dropdown-subheading"], ["mat-icon-button", "", "type", "button", 3, "matMenuTriggerFor"], ["svgIcon", "mat:settings", 1, "notifications-header-icon"], [1, "dropdown-content"], ["class", "notification flex items-center", "matRipple", "", 3, "read", "routerLink", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "dropdown-footer", "flex", "items-center", "justify-center"], ["color", "primary", "mat-button", "", "type", "button"], ["xPosition", "before", "yPosition", "below"], ["settingsMenu", "matMenu"], ["mat-menu-item", ""], ["svgIcon", "mat:clear_all"], ["svgIcon", "mat:notifications_off"], ["matRipple", "", 1, "notification", "flex", "items-center", 3, "routerLink"], [1, "notification-icon", "flex-none", 3, "ngClass", "svgIcon"], [1, "flex-auto"], [1, "notification-label"], [1, "notification-description"], ["svgIcon", "mat:chevron_right", 1, "notification-chevron", "flex-none"]],
    template: function ToolbarNotificationsDropdownComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Notifications");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "mat-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](10, ToolbarNotificationsDropdownComponent_a_10_Template, 9, 10, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 8)(12, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "MARK ALL AS READ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "mat-menu", 10, 11)(16, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](17, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, "Mark all as read");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23, "Disable Notifications");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" You have ", ctx.notifications.length, " new notifications. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matMenuTriggerFor", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.notifications)("ngForTrackBy", ctx.trackById);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatIconButton, _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__.MatMenuTrigger, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgFor, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatRipple, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgClass, _vex_pipes_vex_date_format_relative_vex_date_format_relative_pipe__WEBPACK_IMPORTED_MODULE_2__.VexDateFormatRelativePipe],
    styles: [".dropdown[_ngcontent-%COMP%] {\n  background: var(--vex-background-card);\n  border-bottom-left-radius: var(--vex-border-radius);\n  border-bottom-right-radius: var(--vex-border-radius);\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  max-width: 100vw;\n  overflow: hidden;\n  width: 350px;\n  border-radius: var(--vex-border-radius);\n}\n\n.dropdown-header[_ngcontent-%COMP%] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-color-primary-600) / var(--tw-bg-opacity));\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-color-on-primary-600) / var(--tw-text-opacity));\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.dropdown-heading[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n\n.dropdown-subheading[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n\n.dropdown-content[_ngcontent-%COMP%] {\n  max-height: 291px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.dropdown-footer[_ngcontent-%COMP%] {\n  border-top-width: 1px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-background-app-bar-rgb) / var(--tw-bg-opacity));\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n\n.notification[_ngcontent-%COMP%] {\n  position: relative;\n  -webkit-user-select: none;\n          user-select: none;\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-text-rgb) / var(--tw-text-opacity));\n  text-decoration-line: none;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.notification[_ngcontent-%COMP%]:hover {\n  background-color: var(--vex-background-hover);\n}\n.notification[_ngcontent-%COMP%]:hover   .notification-label[_ngcontent-%COMP%] {\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-color-primary-600) / var(--tw-text-opacity));\n}\n.notification.read[_ngcontent-%COMP%] {\n  opacity: 0.5;\n}\n\n.notification-icon[_ngcontent-%COMP%] {\n  margin-inline-end: 1.5rem;\n}\n\n.notification-label[_ngcontent-%COMP%] {\n  transition: inherit;\n}\n\n.notification-description[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-secondary-text-rgb) / var(--tw-text-opacity));\n}\n\n.notification-chevron[_ngcontent-%COMP%] {\n  font-size: 18px;\n  height: 18px;\n  width: 18px;\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n\n.notification[_ngcontent-%COMP%]    + .notification[_ngcontent-%COMP%] {\n  border-top-width: 1px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3Rvb2xiYXIvdG9vbGJhci1ub3RpZmljYXRpb25zL3Rvb2xiYXItbm90aWZpY2F0aW9ucy1kcm9wZG93bi90b29sYmFyLW5vdGlmaWNhdGlvbnMtZHJvcGRvd24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxzQ0FBQTtFQUNBLG1EQUFBO0VBQ0Esb0RBQUE7RUFDQSwrRUFBQTtFQUFBLG1HQUFBO0VBQUEsdUdBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLHVDQUFBO0FBQ0Y7O0FBR0U7RUFBQSxrQkFBQTtFQUFBLDBFQUFBO0VBQUEsaUJBQUE7RUFBQSxvQkFBQTtFQUFBLG9CQUFBO0VBQUEscUJBQUE7RUFBQSxvQkFBQTtFQUFBLG9FQUFBO0VBQUEsMEVBQUE7RUFBQSw4RkFBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQSxtQkFBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQSxrQkFBQTtFQUFBO0FBQUE7O0FBR0Y7RUFDRSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFHRTtFQUFBLHFCQUFBO0VBQUEsa0JBQUE7RUFBQSwrRUFBQTtFQUFBLG1CQUFBO0VBQUEsc0JBQUE7RUFBQSxvQkFBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQSxrQkFBQTtFQUFBLHlCQUFBO1VBQUEsaUJBQUE7RUFBQSxpQkFBQTtFQUFBLG9CQUFBO0VBQUEsb0JBQUE7RUFBQSxxQkFBQTtFQUFBLG9CQUFBO0VBQUEsbUVBQUE7RUFBQSwwQkFBQTtFQUFBLHdCQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBO0FBQUE7QUFHRTtFQUFBO0FBQUE7QUFHRTtFQUFBLG9CQUFBO0VBQUE7QUFBQTtBQUtGO0VBQUE7QUFBQTs7QUFLRjtFQUFBO0FBQUE7O0FBR0Y7RUFDRSxtQkFBQTtBQUZGOztBQU1FO0VBQUEsa0JBQUE7RUFBQSxpQkFBQTtFQUFBLG9CQUFBO0VBQUE7QUFBQTs7QUFHRjtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLG9CQUFBO0VBQUEsZ0RBQUE7QUFGRjs7QUFNRTtFQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIuZHJvcGRvd24ge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKTtcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogdmFyKC0tdmV4LWJvcmRlci1yYWRpdXMpO1xuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogdmFyKC0tdmV4LWJvcmRlci1yYWRpdXMpO1xuICBAYXBwbHkgc2hhZG93LWxnO1xuICBtYXgtd2lkdGg6IDEwMHZ3O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMzUwcHg7XG4gIEBhcHBseSByb3VuZGVkO1xufVxuXG4uZHJvcGRvd24taGVhZGVyIHtcbiAgQGFwcGx5IGJnLXByaW1hcnktNjAwIHNoYWRvdyB0ZXh0LW9uLXByaW1hcnktNjAwIHB5LTQgcHgtNjtcbn1cblxuLmRyb3Bkb3duLWhlYWRpbmcge1xuICBAYXBwbHkgdGV4dC1sZztcbn1cblxuLmRyb3Bkb3duLXN1YmhlYWRpbmcge1xuICBAYXBwbHkgdGV4dC14cztcbn1cblxuLmRyb3Bkb3duLWNvbnRlbnQge1xuICBtYXgtaGVpZ2h0OiAyOTFweDsgLy8gNzNweCBoZWlnaHQgb2YgMSBub3RpZmljYXRpb24gKiA0XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgb3ZlcmZsb3cteTogYXV0bztcbn1cblxuLmRyb3Bkb3duLWZvb3RlciB7XG4gIEBhcHBseSBiZy1hcHAtYmFyIGJvcmRlci10IHB5LTIgcHgtNjtcbn1cblxuLm5vdGlmaWNhdGlvbiB7XG4gIEBhcHBseSB0ZXh0LWRlZmF1bHQgcmVsYXRpdmUgc2VsZWN0LW5vbmUgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNDAwIGVhc2Utb3V0LXN3aWZ0IHB5LTQgcHgtNiBuby11bmRlcmxpbmU7XG5cbiAgJjpob3ZlciB7XG4gICAgQGFwcGx5IGJnLWhvdmVyO1xuXG4gICAgLm5vdGlmaWNhdGlvbi1sYWJlbCB7XG4gICAgICBAYXBwbHkgdGV4dC1wcmltYXJ5LTYwMDtcbiAgICB9XG4gIH1cblxuICAmLnJlYWQge1xuICAgIEBhcHBseSBvcGFjaXR5LTUwO1xuICB9XG59XG5cbi5ub3RpZmljYXRpb24taWNvbiB7XG4gIEBhcHBseSBtZS02O1xufVxuXG4ubm90aWZpY2F0aW9uLWxhYmVsIHtcbiAgdHJhbnNpdGlvbjogaW5oZXJpdDtcbn1cblxuLm5vdGlmaWNhdGlvbi1kZXNjcmlwdGlvbiB7XG4gIEBhcHBseSB0ZXh0LXNlY29uZGFyeSB0ZXh0LXhzO1xufVxuXG4ubm90aWZpY2F0aW9uLWNoZXZyb24ge1xuICBmb250LXNpemU6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgd2lkdGg6IDE4cHg7XG4gIEBhcHBseSB0ZXh0LWdyYXktNDAwO1xufVxuXG4ubm90aWZpY2F0aW9uICsgLm5vdGlmaWNhdGlvbiB7XG4gIEBhcHBseSBib3JkZXItdDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 12824:
/*!*****************************************************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/toolbar-notifications/toolbar-notifications.component.ts ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToolbarNotificationsComponent: () => (/* binding */ ToolbarNotificationsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _toolbar_notifications_dropdown_toolbar_notifications_dropdown_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toolbar-notifications-dropdown/toolbar-notifications-dropdown.component */ 41951);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover.service */ 92371);








const _c0 = ["originRef"];
class ToolbarNotificationsComponent {
  constructor(popover, cd) {
    this.popover = popover;
    this.cd = cd;
    this.dropdownOpen = false;
  }
  ngOnInit() {}
  showPopover() {
    this.dropdownOpen = true;
    this.cd.markForCheck();
    if (!this.originRef) {
      throw new Error('originRef undefined!');
    }
    const popoverRef = this.popover.open({
      content: _toolbar_notifications_dropdown_toolbar_notifications_dropdown_component__WEBPACK_IMPORTED_MODULE_0__.ToolbarNotificationsDropdownComponent,
      origin: this.originRef,
      offsetY: 12,
      position: [{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom'
      }, {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top'
      }]
    });
    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
  static #_ = this.ɵfac = function ToolbarNotificationsComponent_Factory(t) {
    return new (t || ToolbarNotificationsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_1__.VexPopoverService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: ToolbarNotificationsComponent,
    selectors: [["vex-toolbar-notifications"]],
    viewQuery: function ToolbarNotificationsComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 7, _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.originRef = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 3,
    vars: 2,
    consts: [["mat-icon-button", "", "type", "button", 1, "button", 3, "click"], ["originRef", ""], ["color", "primary", "svgIcon", "mat:notifications_active"]],
    template: function ToolbarNotificationsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ToolbarNotificationsComponent_Template_button_click_0_listener() {
          return ctx.showPopover();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("bg-hover", ctx.dropdownOpen);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    changeDetection: 0
  });
}

/***/ }),

/***/ 97799:
/*!******************************************************************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/toolbar-user/toolbar-user-dropdown/toolbar-user-dropdown.component.ts ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToolbarUserDropdownComponent: () => (/* binding */ ToolbarUserDropdownComponent)
/* harmony export */ });
/* harmony import */ var _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/utils/track-by */ 47637);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_components_vex_popover_vex_popover_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover-ref */ 95925);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../core/services/auth.service */ 90304);

















function ToolbarUserDropdownComponent_a_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ToolbarUserDropdownComponent_a_11_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r6.close());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-icon", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 25)(3, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](7, "mat-icon", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", item_r5.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", item_r5.colorClass)("svgIcon", item_r5.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r5.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r5.description);
  }
}
function ToolbarUserDropdownComponent_ng_container_14_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-icon", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "mat-icon", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const status_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", status_r8.colorClass)("svgIcon", status_r8.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](status_r8.label);
  }
}
function ToolbarUserDropdownComponent_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ToolbarUserDropdownComponent_ng_container_14_span_1_Template, 5, 3, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const status_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", status_r8 === ctx_r1.activeStatus);
  }
}
function ToolbarUserDropdownComponent_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ToolbarUserDropdownComponent_button_19_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r13);
      const status_r11 = restoredCtx.$implicit;
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r12.setStatus(status_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-icon", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const status_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", status_r11.colorClass)("svgIcon", status_r11.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](status_r11.label);
  }
}
class ToolbarUserDropdownComponent {
  constructor(cd, popoverRef, authService) {
    this.cd = cd;
    this.popoverRef = popoverRef;
    this.authService = authService;
    this.items = [{
      id: '1',
      icon: 'mat:account_circle',
      label: 'Mi Perfil',
      description: 'Información Personal',
      colorClass: 'text-teal-600',
      route: '/apps/social'
    }, {
      id: '2',
      icon: 'mat:move_to_inbox',
      label: 'Mi Bandeja',
      description: 'Mensajes y Noticias',
      colorClass: 'text-primary-600',
      route: '/apps/chat'
    }, {
      id: '3',
      icon: 'mat:list_alt',
      label: 'Mis Proyectos',
      description: 'Tareas y Proyectos Activos',
      colorClass: 'text-amber-600',
      route: '/apps/scrumboard'
    }, {
      id: '4',
      icon: 'mat:table_chart',
      label: 'Información de Facturación',
      description: 'Precios y Plan Actual',
      colorClass: 'text-purple-600',
      route: '/pages/pricing'
    }];
    this.statuses = [{
      id: 'online',
      label: 'En línea',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600'
    }, {
      id: 'away',
      label: 'Ausente',
      icon: 'mat:access_time',
      colorClass: 'text-orange-600'
    }, {
      id: 'dnd',
      label: 'No molestar',
      icon: 'mat:do_not_disturb',
      colorClass: 'text-red-600'
    }, {
      id: 'offline',
      label: 'Desconectado',
      icon: 'mat:offline_bolt',
      colorClass: 'text-gray-600'
    }];
    this.activeStatus = this.statuses[0];
    this.trackById = _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_0__.trackById;
    this.currentUser$ = this.authService.currentUser$;
  }
  ngOnInit() {}
  setStatus(status) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }
  close() {
    this.popoverRef.close();
  }
  logout() {
    this.authService.logout();
    this.close();
  }
  static #_ = this.ɵfac = function ToolbarUserDropdownComponent_Factory(t) {
    return new (t || ToolbarUserDropdownComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_3__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_ref__WEBPACK_IMPORTED_MODULE_1__.VexPopoverRef), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: ToolbarUserDropdownComponent,
    selectors: [["vex-toolbar-user-dropdown"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 38,
    vars: 11,
    consts: [[1, "dropdown"], [1, "dropdown-header", "flex", "items-center", "justify-between"], [1, "flex", "items-center"], [1, "dropdown-heading-icon", "flex", "items-center", "justify-center"], ["svgIcon", "mat:person"], [1, "dropdown-heading"], ["mat-icon-button", "", "matTooltip", "Configuraci\u00F3n", "matTooltipPosition", "before", "type", "button", 3, "matMenuTriggerFor"], ["svgIcon", "mat:settings", 1, "notifications-header-icon"], [1, "dropdown-content"], ["class", "notification flex items-center", "matRipple", "", 3, "routerLink", "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "dropdown-footer", "flex", "items-center", "justify-between"], ["mat-button", "", "type", "button", 1, "dropdown-footer-select", 3, "matMenuTriggerFor"], [4, "ngFor", "ngForOf", "ngForTrackBy"], ["color", "primary", "mat-button", "", 3, "click"], ["xPosition", "before", "yPosition", "below"], ["statusMenu", "matMenu"], ["mat-menu-item", "", 3, "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["settingsMenu", "matMenu"], ["mat-menu-item", ""], ["svgIcon", "mat:business"], ["svgIcon", "mat:verified_user"], ["svgIcon", "mat:lock"], ["svgIcon", "mat:notifications_off"], ["matRipple", "", 1, "notification", "flex", "items-center", 3, "routerLink", "click"], [1, "notification-icon", "flex-none", 3, "ngClass", "svgIcon"], [1, "flex-auto"], [1, "notification-label"], [1, "notification-description"], ["svgIcon", "mat:chevron_right", 1, "notification-chevron", "flex-none"], [4, "ngIf"], [3, "ngClass", "svgIcon"], ["svgIcon", "mat:arrow_drop_down", 1, "dropdown-footer-select-caret"], ["mat-menu-item", "", 3, "click"]],
    template: function ToolbarUserDropdownComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](7, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](11, ToolbarUserDropdownComponent_a_11_Template, 8, 5, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 10)(13, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, ToolbarUserDropdownComponent_ng_container_14_Template, 2, 1, "ng-container", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ToolbarUserDropdownComponent_Template_a_click_15_listener() {
          return ctx.logout();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, "Cerrar Sesi\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "mat-menu", 14, 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](19, ToolbarUserDropdownComponent_button_19_Template, 4, 3, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "mat-menu", 14, 17)(22, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "mat-icon", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](25, "Change Address");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](27, "mat-icon", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](29, "Change Username");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](31, "mat-icon", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Change Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](35, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](37, "Disable Notifications");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](18);
        const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](21);
        let tmp_0_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](((tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](7, 9, ctx.currentUser$)) == null ? null : tmp_0_0.name) || "Usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matMenuTriggerFor", _r4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.items)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matMenuTriggerFor", _r2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.statuses)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.statuses)("ngForTrackBy", ctx.trackById);
      }
    },
    dependencies: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatAnchor, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatIconButton, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__.MatTooltip, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__.MatMenuTrigger, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgFor, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatRipple, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.AsyncPipe],
    styles: [".dropdown[_ngcontent-%COMP%] {\n  background: var(--vex-background-card);\n  border-bottom-left-radius: var(--vex-border-radius);\n  border-bottom-right-radius: var(--vex-border-radius);\n  max-width: 100vw;\n  overflow: hidden;\n  width: 350px;\n  border-radius: var(--vex-border-radius);\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.dropdown-header[_ngcontent-%COMP%] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-color-primary-600) / var(--tw-bg-opacity));\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-right: 1rem;\n  padding-left: 0.75rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-color-on-primary-600) / var(--tw-text-opacity));\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.dropdown-heading-icon[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 999999px;\n  margin-right: 0.75rem;\n  padding: 0.5rem;\n}\n.dropdown-heading-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 32px;\n  height: 32px;\n  width: 32px;\n}\n\n.dropdown-heading[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n\n.dropdown-content[_ngcontent-%COMP%] {\n  max-height: 300px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.dropdown-footer[_ngcontent-%COMP%] {\n  border-top-width: 1px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-background-app-bar-rgb) / var(--tw-bg-opacity));\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n.dropdown-footer-select[_ngcontent-%COMP%] {\n  padding-left: 0.75rem;\n}\n.dropdown-footer-select[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]:not(.dropdown-footer-select-caret) {\n  vertical-align: -7px !important;\n  margin-right: 0.5rem;\n}\n\n.dropdown-footer-select-caret[_ngcontent-%COMP%] {\n  font-size: 18px;\n  height: 18px;\n  vertical-align: -4px !important;\n  width: 18px;\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n\n.notification[_ngcontent-%COMP%] {\n  position: relative;\n  -webkit-user-select: none;\n          user-select: none;\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-text-rgb) / var(--tw-text-opacity));\n  text-decoration-line: none;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 400ms;\n  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.notification[_ngcontent-%COMP%]:hover {\n  background-color: var(--vex-background-hover);\n}\n.notification[_ngcontent-%COMP%]:hover   .notification-label[_ngcontent-%COMP%] {\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-color-primary-600) / var(--tw-text-opacity));\n}\n.notification.read[_ngcontent-%COMP%] {\n  opacity: 0.5;\n}\n\n.notification-icon[_ngcontent-%COMP%] {\n  margin-right: 1.5rem;\n}\n\n.notification-label[_ngcontent-%COMP%] {\n  transition: inherit;\n}\n\n.notification-description[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-secondary-text-rgb) / var(--tw-text-opacity));\n}\n\n.notification-chevron[_ngcontent-%COMP%] {\n  font-size: 18px;\n  height: 18px;\n  width: 18px;\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n\n.notification[_ngcontent-%COMP%]    + .notification[_ngcontent-%COMP%] {\n  border-top-width: 1px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3Rvb2xiYXIvdG9vbGJhci11c2VyL3Rvb2xiYXItdXNlci1kcm9wZG93bi90b29sYmFyLXVzZXItZHJvcGRvd24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxzQ0FBQTtFQUNBLG1EQUFBO0VBQ0Esb0RBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLHVDQUFBO0VBQUEsK0VBQUE7RUFBQSxtR0FBQTtFQUFBLHVHQUFBO0FBQ0Y7O0FBR0U7RUFBQSxrQkFBQTtFQUFBLDBFQUFBO0VBQUEsaUJBQUE7RUFBQSxvQkFBQTtFQUFBLG1CQUFBO0VBQUEscUJBQUE7RUFBQSxvQkFBQTtFQUFBLG9FQUFBO0VBQUEsMEVBQUE7RUFBQSw4RkFBQTtFQUFBO0FBQUE7O0FBR0Y7RUFDRSxvQ0FBQTtFQUNBLHVCQUFBO0VBQ0EscUJBQUE7RUFBQSxlQUFBO0FBQ0Y7QUFDRTtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtBQUNKOztBQUlFO0VBQUEsbUJBQUE7RUFBQTtBQUFBOztBQUdGO0VBQ0UsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBQUY7O0FBSUU7RUFBQSxxQkFBQTtFQUFBLGtCQUFBO0VBQUEsK0VBQUE7RUFBQSxvQkFBQTtFQUFBLHFCQUFBO0VBQUEsb0JBQUE7RUFBQTtBQUFBOztBQUlBO0VBQUE7QUFBQTtBQUVBO0VBQ0UsK0JBQUE7RUFDQSxvQkFBQTtBQUFKOztBQUlBO0VBQ0UsZUFBQTtFQUNBLFlBQUE7RUFDQSwrQkFBQTtFQUNBLFdBQUE7RUFDQSxvQkFBQTtFQUFBLGdEQUFBO0FBREY7O0FBS0U7RUFBQSxrQkFBQTtFQUFBLHlCQUFBO1VBQUEsaUJBQUE7RUFBQSxpQkFBQTtFQUFBLG9CQUFBO0VBQUEsb0JBQUE7RUFBQSxxQkFBQTtFQUFBLG9CQUFBO0VBQUEsbUVBQUE7RUFBQSwwQkFBQTtFQUFBLHdCQUFBO0VBQUEsd0RBQUE7RUFBQSwwQkFBQTtFQUFBO0FBQUE7QUFHRTtFQUFBO0FBQUE7QUFHRTtFQUFBLG9CQUFBO0VBQUE7QUFBQTtBQUtGO0VBQUE7QUFBQTs7QUFLRjtFQUFBO0FBQUE7O0FBR0Y7RUFDRSxtQkFBQTtBQUpGOztBQVFFO0VBQUEsa0JBQUE7RUFBQSxpQkFBQTtFQUFBLG9CQUFBO0VBQUE7QUFBQTs7QUFHRjtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLG9CQUFBO0VBQUEsZ0RBQUE7QUFKRjs7QUFRRTtFQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIuZHJvcGRvd24ge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKTtcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogdmFyKC0tdmV4LWJvcmRlci1yYWRpdXMpO1xuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogdmFyKC0tdmV4LWJvcmRlci1yYWRpdXMpO1xuICBtYXgtd2lkdGg6IDEwMHZ3O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMzUwcHg7XG4gIEBhcHBseSByb3VuZGVkIHNoYWRvdy1sZztcbn1cblxuLmRyb3Bkb3duLWhlYWRlciB7XG4gIEBhcHBseSBiZy1wcmltYXJ5LTYwMCB0ZXh0LW9uLXByaW1hcnktNjAwIHB5LTQgcHItNCBwbC0zIHNoYWRvdztcbn1cblxuLmRyb3Bkb3duLWhlYWRpbmctaWNvbiB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTtcbiAgYm9yZGVyLXJhZGl1czogOTk5OTk5cHg7XG4gIEBhcHBseSBwLTIgbXItMztcblxuICAubWF0LWljb24ge1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBoZWlnaHQ6IDMycHg7XG4gICAgd2lkdGg6IDMycHg7XG4gIH1cbn1cblxuLmRyb3Bkb3duLWhlYWRpbmcge1xuICBAYXBwbHkgdGV4dC1sZztcbn1cblxuLmRyb3Bkb3duLWNvbnRlbnQge1xuICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICBvdmVyZmxvdy15OiBhdXRvO1xufVxuXG4uZHJvcGRvd24tZm9vdGVyIHtcbiAgQGFwcGx5IGJvcmRlci10IGJnLWFwcC1iYXIgcHgtMiBweS0zO1xufVxuXG4uZHJvcGRvd24tZm9vdGVyLXNlbGVjdCB7XG4gIEBhcHBseSBwbC0zO1xuXG4gIC5tYXQtaWNvbjpub3QoLmRyb3Bkb3duLWZvb3Rlci1zZWxlY3QtY2FyZXQpIHtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogLTdweCAhaW1wb3J0YW50O1xuICAgIEBhcHBseSBtci0yO1xuICB9XG59XG5cbi5kcm9wZG93bi1mb290ZXItc2VsZWN0LWNhcmV0IHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIHZlcnRpY2FsLWFsaWduOiAtNHB4ICFpbXBvcnRhbnQ7XG4gIHdpZHRoOiAxOHB4O1xuICBAYXBwbHkgdGV4dC1ncmF5LTQwMDtcbn1cblxuLm5vdGlmaWNhdGlvbiB7XG4gIEBhcHBseSB0ZXh0LWRlZmF1bHQgcmVsYXRpdmUgc2VsZWN0LW5vbmUgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNDAwIGVhc2Utb3V0LXN3aWZ0IHB5LTQgcHgtNiBuby11bmRlcmxpbmU7XG5cbiAgJjpob3ZlciB7XG4gICAgQGFwcGx5IGJnLWhvdmVyO1xuXG4gICAgLm5vdGlmaWNhdGlvbi1sYWJlbCB7XG4gICAgICBAYXBwbHkgdGV4dC1wcmltYXJ5LTYwMDtcbiAgICB9XG4gIH1cblxuICAmLnJlYWQge1xuICAgIEBhcHBseSBvcGFjaXR5LTUwO1xuICB9XG59XG5cbi5ub3RpZmljYXRpb24taWNvbiB7XG4gIEBhcHBseSBtci02O1xufVxuXG4ubm90aWZpY2F0aW9uLWxhYmVsIHtcbiAgdHJhbnNpdGlvbjogaW5oZXJpdDtcbn1cblxuLm5vdGlmaWNhdGlvbi1kZXNjcmlwdGlvbiB7XG4gIEBhcHBseSB0ZXh0LXNlY29uZGFyeSB0ZXh0LXhzO1xufVxuXG4ubm90aWZpY2F0aW9uLWNoZXZyb24ge1xuICBmb250LXNpemU6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgd2lkdGg6IDE4cHg7XG4gIEBhcHBseSB0ZXh0LWdyYXktNDAwO1xufVxuXG4ubm90aWZpY2F0aW9uICsgLm5vdGlmaWNhdGlvbiB7XG4gIEBhcHBseSBib3JkZXItdDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
    changeDetection: 0
  });
}

/***/ }),

/***/ 19546:
/*!***********************************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/toolbar-user/toolbar-user.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToolbarUserComponent: () => (/* binding */ ToolbarUserComponent)
/* harmony export */ });
/* harmony import */ var _toolbar_user_dropdown_toolbar_user_dropdown_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toolbar-user-dropdown/toolbar-user-dropdown.component */ 97799);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover.service */ 92371);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 90304);









class ToolbarUserComponent {
  constructor(popover, cd, authService) {
    this.popover = popover;
    this.cd = cd;
    this.authService = authService;
    this.dropdownOpen = false;
    this.currentUser$ = this.authService.currentUser$;
  }
  ngOnInit() {}
  showPopover(originRef) {
    this.dropdownOpen = true;
    this.cd.markForCheck();
    const popoverRef = this.popover.open({
      content: _toolbar_user_dropdown_toolbar_user_dropdown_component__WEBPACK_IMPORTED_MODULE_0__.ToolbarUserDropdownComponent,
      origin: originRef,
      offsetY: 12,
      position: [{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom'
      }, {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top'
      }]
    });
    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
  static #_ = this.ɵfac = function ToolbarUserComponent_Factory(t) {
    return new (t || ToolbarUserComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_1__.VexPopoverService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_3__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: ToolbarUserComponent,
    selectors: [["vex-toolbar-user"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 7,
    vars: 5,
    consts: [["matRipple", "", 1, "flex", "items-center", "rounded", "cursor-pointer", "relative", "transition", "duration-400", "ease-out-swift", "select-none", "py-1", "pr-1", "pl-3", "hover:bg-hover", 3, "click"], ["originRef", ""], [1, "body-1", "font-medium", "leading-snug", "ltr:mr-3", "rtl:ml-3", "hidden", "sm:block"], [1, "rounded-full", "h-9", "w-9", "flex", "items-center", "justify-center", "text-primary-600", "bg-primary-600/10"], ["svgIcon", "mat:person"]],
    template: function ToolbarUserComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ToolbarUserComponent_Template_div_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
          const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](1);
          return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.showPopover(_r0));
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        let tmp_1_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("bg-hover", ctx.dropdownOpen);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ((tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 3, ctx.currentUser$)) == null ? null : tmp_1_0.name) || "Usuario", " ");
      }
    },
    dependencies: [_angular_material_core__WEBPACK_IMPORTED_MODULE_4__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_4__.MatRipple, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_6__.AsyncPipe],
    encapsulation: 2,
    changeDetection: 0
  });
}

/***/ }),

/***/ 60052:
/*!*****************************************************************!*\
  !*** ./src/app/layouts/components/toolbar/toolbar.component.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToolbarComponent: () => (/* binding */ ToolbarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs/operators */ 81891);
/* harmony import */ var _mega_menu_mega_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mega-menu/mega-menu.component */ 62276);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../navigation/navigation.component */ 99373);
/* harmony import */ var _toolbar_user_toolbar_user_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toolbar-user/toolbar-user.component */ 19546);
/* harmony import */ var _toolbar_notifications_toolbar_notifications_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toolbar-notifications/toolbar-notifications.component */ 12824);
/* harmony import */ var _navigation_navigation_item_navigation_item_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../navigation/navigation-item/navigation-item.component */ 9208);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/utils/check-router-childs-data */ 39681);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 60839);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @vex/config/vex-config.service */ 50376);
/* harmony import */ var _core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../core/navigation/navigation.service */ 20120);
/* harmony import */ var _vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @vex/components/vex-popover/vex-popover.service */ 92371);























const _c0 = () => ["/"];
function ToolbarComponent_a_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "a", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](1, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "h1", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](8, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("hidden", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 4, ctx_r0.isDesktop$));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 6, ctx_r0.dynamicTitle$), " ");
  }
}
function ToolbarComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 14)(1, "h1", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 1, ctx_r1.dynamicTitle$), " ");
  }
}
function ToolbarComponent_div_9_vex_navigation_item_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](0, "vex-navigation-item", 18);
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("item", item_r6);
  }
}
function ToolbarComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](2, ToolbarComponent_div_9_vex_navigation_item_2_Template, 1, 1, "vex-navigation-item", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("hidden", !_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 3, ctx_r2.isDesktop$));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 5, ctx_r2.navigationItems$));
  }
}
function ToolbarComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](1, "vex-toolbar-user");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function ToolbarComponent_vex_navigation_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](0, "vex-navigation");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "async");
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("hidden", !_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 2, ctx_r4.isDesktop$));
  }
}
class ToolbarComponent {
  constructor(layoutService, configService, navigationService, popoverService, router) {
    this.layoutService = layoutService;
    this.configService = configService;
    this.navigationService = navigationService;
    this.popoverService = popoverService;
    this.router = router;
    this.showShadow = false;
    this.navigationItems$ = this.navigationService.items$;
    this.isHorizontalLayout$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(config => config.layout === 'horizontal'));
    this.isVerticalLayout$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(config => config.layout === 'vertical'));
    this.isNavbarInToolbar$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(config => config.navbar.position === 'in-toolbar'));
    this.isNavbarBelowToolbar$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(config => config.navbar.position === 'below-toolbar'));
    this.userVisible$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(config => config.toolbar.user.visible));
    this.title$ = this.configService.select(config => config.sidenav.title);
    // Título dinámico basado en la ruta actual
    this.dynamicTitle$ = this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_13__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(() => {
      const title = this.getPageTitle();
      console.log('🔄 ToolbarComponent - Título generado:', title);
      return title;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.startWith)('Dashboard Analytics'));
    this.isDesktop$ = this.layoutService.isDesktop$;
    this.megaMenuOpen$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)(false);
    this.destroyRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_10__.DestroyRef);
  }
  ngOnInit() {
    this.router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_13__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.startWith)(null), (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_16__.takeUntilDestroyed)(this.destroyRef)).subscribe(() => {
      this.showShadow = (0,_vex_utils_check_router_childs_data__WEBPACK_IMPORTED_MODULE_5__.checkRouterChildsData)(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled ?? false);
      // Debug: mostrar el título actual
      const currentTitle = this.getPageTitle();
      console.log('🔄 ToolbarComponent - Título actual:', currentTitle);
      console.log('🔄 ToolbarComponent - URL actual:', this.router.url);
    });
  }
  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }
  openSidenav() {
    this.layoutService.openSidenav();
  }
  openMegaMenu(origin) {
    this.megaMenuOpen$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.of)(this.popoverService.open({
      content: _mega_menu_mega_menu_component__WEBPACK_IMPORTED_MODULE_0__.MegaMenuComponent,
      origin,
      offsetY: 12,
      position: [{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }, {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top'
      }]
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.switchMap)(popoverRef => popoverRef.afterClosed$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.map)(() => false))), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.startWith)(true));
  }
  openSearch() {
    this.layoutService.openSearch();
  }
  /**
   * Obtener el título de la página basado en la ruta actual
   */
  getPageTitle() {
    const url = this.router.url;
    // Mesa de Control
    if (url.includes('/mesa-control')) {
      if (url.includes('/validacion')) {
        return 'Mesa de Control - Validación';
      } else if (url.includes('/dashboard')) {
        return 'Mesa de Control - Dashboard Principal';
      } else if (url.includes('/monitoreo')) {
        return 'Mesa de Control - Monitoreo en Tiempo Real';
      } else if (url.includes('/reportes')) {
        return 'Mesa de Control - Reportes';
      } else {
        return 'Mesa de Control';
      }
    }
    // Configuración
    if (url.includes('/configuracion')) {
      if (url.includes('/agencias')) {
        return 'Configuración - Agencias';
      } else if (url.includes('/usuarios')) {
        return 'Configuración - Usuarios';
      } else if (url.includes('/motivos-extraordinarios')) {
        return 'Configuración - Motivos Extraordinarios';
      } else if (url.includes('/motivos-rechazo')) {
        return 'Configuración - Motivos de Aprobación y Rechazo';
      } else if (url.includes('/documentos-requeridos')) {
        return 'Configuración - Documentos Requeridos';
      } else if (url.includes('/tipos-documento')) {
        return 'Configuración - Tipos de Documento';
      } else if (url.includes('/tipos-cliente')) {
        return 'Configuración - Tipos de Cliente';
      } else if (url.includes('/catalogos')) {
        return 'Configuración - Catálogos';
      } else {
        return 'Configuración';
      }
    }
    // Procesos
    if (url.includes('/procesos')) {
      if (url.includes('/integracion')) {
        return 'Integración de Expediente';
      } else {
        return 'Procesos';
      }
    }
    // Mesa de Control
    if (url.includes('/mesa-control')) {
      if (url.includes('/validacion')) {
        return 'Mesa de Control - Validación';
      } else if (url.includes('/monitoreo')) {
        return 'Mesa de Control - Monitoreo';
      } else if (url.includes('/reportes')) {
        return 'Mesa de Control - Reportes';
      } else if (url.includes('/dashboard')) {
        return 'Mesa de Control - Dashboard';
      } else {
        return 'Mesa de Control';
      }
    }
    // Dashboard
    if (url.includes('/dashboards')) {
      return 'Dashboard';
    }
    // Página principal
    if (url === '/' || url === '') {
      return 'Dashboard Analytics';
    }
    // Por defecto
    return 'Dashboard Analytics';
  }
  static #_ = this.ɵfac = function ToolbarComponent_Factory(t) {
    return new (t || ToolbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_6__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_7__.VexConfigService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_core_navigation_navigation_service__WEBPACK_IMPORTED_MODULE_8__.NavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_vex_components_vex_popover_vex_popover_service__WEBPACK_IMPORTED_MODULE_9__.VexPopoverService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.Router));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({
    type: ToolbarComponent,
    selectors: [["vex-toolbar"]],
    hostVars: 2,
    hostBindings: function ToolbarComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("shadow-b", ctx.showShadow);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵStandaloneFeature"]],
    decls: 21,
    vars: 27,
    consts: [[1, "toolbar", "text-default", "w-full", "px-6", "flex", "items-center"], ["mat-icon-button", "", "type", "button", 3, "click"], ["svgIcon", "mat:menu"], ["class", "ltr:mr-4 rtl:ml-4 flex items-center", 3, "routerLink", 4, "ngIf"], ["class", "ltr:mr-4 rtl:ml-4 flex items-center", 4, "ngIf"], ["class", "px-6 flex-none flex items-center", 3, "hidden", 4, "ngIf"], [1, "flex-1"], [1, "-mx-1", "flex", "items-center"], [1, "px-1"], ["class", "px-1", 4, "ngIf"], [3, "hidden", 4, "ngIf"], [1, "ltr:mr-4", "rtl:ml-4", "flex", "items-center", 3, "routerLink"], ["alt", "Logo", "src", "assets/img/icons/logos/nexusQtech.svg", 1, "w-8", "select-none"], [1, "text-2xl", "font-bold", "tracking-wide", "ltr:pl-4", "rtl:pr-4", "m-0", "select-none"], [1, "ltr:mr-4", "rtl:ml-4", "flex", "items-center"], [1, "text-2xl", "font-bold", "tracking-wide", "ltr:pl-4", "rtl:pr-4", "m-0", "select-none", "text-gray-900"], [1, "px-6", "flex-none", "flex", "items-center"], [3, "item", 4, "ngFor", "ngForOf"], [3, "item"]],
    template: function ToolbarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function ToolbarComponent_Template_button_click_2_listener() {
          return ctx.openSidenav();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](4, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, ToolbarComponent_a_5_Template, 6, 9, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](6, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, ToolbarComponent_div_7_Template, 4, 3, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](8, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](9, ToolbarComponent_div_9_Template, 4, 7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](10, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](11, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](12, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](13, "div", 7)(14, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](15, "vex-toolbar-notifications");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](16, ToolbarComponent_div_16_Template, 2, 0, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](17, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](18, ToolbarComponent_vex_navigation_18_Template, 2, 4, "vex-navigation", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](19, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](20, "async");
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("container", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 9, ctx.isVerticalLayout$));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("hidden", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 11, ctx.isDesktop$));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](6, 13, ctx.isVerticalLayout$));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](8, 15, ctx.isHorizontalLayout$));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](10, 17, ctx.isVerticalLayout$) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](11, 19, ctx.isNavbarInToolbar$));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](17, 21, ctx.userVisible$));
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](19, 23, ctx.isVerticalLayout$) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](20, 25, ctx.isNavbarBelowToolbar$));
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_18__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_18__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_19__.MatIcon, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterLink, _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuModule, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgFor, _navigation_navigation_item_navigation_item_component__WEBPACK_IMPORTED_MODULE_4__.NavigationItemComponent, _toolbar_notifications_toolbar_notifications_component__WEBPACK_IMPORTED_MODULE_3__.ToolbarNotificationsComponent, _toolbar_user_toolbar_user_component__WEBPACK_IMPORTED_MODULE_2__.ToolbarUserComponent, _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_1__.NavigationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_20__.AsyncPipe],
    styles: ["[_nghost-%COMP%] {\n  background: var(--vex-toolbar-background);\n  box-sizing: border-box;\n  display: block;\n  white-space: nowrap;\n  width: 100%;\n  z-index: var(--vex-toolbar-z-index);\n  border-bottom-width: 1px;\n  --tw-backdrop-blur: blur(8px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n\n.toolbar[_ngcontent-%COMP%] {\n  height: var(--vex-toolbar-height);\n}\n\na[_ngcontent-%COMP%] {\n  text-decoration: none;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9jb21wb25lbnRzL3Rvb2xiYXIvdG9vbGJhci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHlDQUFBO0VBQ0Esc0JBQUE7RUFDQSxjQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0VBQ0EsbUNBQUE7RUFDQSx3QkFBQTtFQUFBLDZCQUFBO0VBQUEsK1FBQUE7VUFBQSx1UUFBQTtBQUNGOztBQUVBO0VBQ0UsaUNBQUE7QUFDRjs7QUFFQTtFQUNFLHFCQUFBO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGJhY2tncm91bmQ6IHZhcigtLXZleC10b29sYmFyLWJhY2tncm91bmQpO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgd2lkdGg6IDEwMCU7XG4gIHotaW5kZXg6IHZhcigtLXZleC10b29sYmFyLXotaW5kZXgpO1xuICBAYXBwbHkgYmFja2Ryb3AtYmx1ciBib3JkZXItYjtcbn1cblxuLnRvb2xiYXIge1xuICBoZWlnaHQ6IHZhcigtLXZleC10b29sYmFyLWhlaWdodCk7XG59XG5cbmEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 78349:
/*!****************************************************!*\
  !*** ./src/app/layouts/layout/layout.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutComponent: () => (/* binding */ LayoutComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 33839);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _components_sidenav_sidenav_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/sidenav/sidenav.component */ 46468);
/* harmony import */ var _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/toolbar/toolbar.component */ 60052);
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/footer/footer.component */ 93147);
/* harmony import */ var _components_quickpanel_quickpanel_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/quickpanel/quickpanel.component */ 74132);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _base_layout_base_layout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../base-layout/base-layout.component */ 48158);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/sidenav */ 31465);
/* harmony import */ var _components_toolbar_search_search_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/toolbar/search/search.component */ 6182);
/* harmony import */ var _vex_components_vex_progress_bar_vex_progress_bar_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @vex/components/vex-progress-bar/vex-progress-bar.component */ 6912);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @vex/services/vex-layout.service */ 64952);
/* harmony import */ var _vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @vex/config/vex-config.service */ 50376);

















function LayoutComponent_vex_base_layout_0_vex_footer_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "vex-footer", 9);
  }
}
function LayoutComponent_vex_base_layout_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "vex-base-layout");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "vex-progress-bar")(2, "vex-search");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "mat-sidenav-container", 1)(4, "mat-sidenav", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("closedStart", function LayoutComponent_vex_base_layout_0_Template_mat_sidenav_closedStart_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r3.onSidenavClosed());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](6, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](8, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](9, "vex-sidenav", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](10, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "mat-sidenav", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("closedStart", function LayoutComponent_vex_base_layout_0_Template_mat_sidenav_closedStart_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r4);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r5.onQuickpanelClosed());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](12, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](13, "vex-quickpanel");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "mat-sidenav-content", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](15, "vex-toolbar", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "main", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](17, "router-outlet");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, LayoutComponent_vex_base_layout_0_vex_footer_18_Template, 1, 0, "vex-footer", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const config_r1 = ctx.ngIf;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disableClose", !!_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 9, ctx_r0.sidenavDisableClose$))("fixedInViewport", !!_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](6, 11, ctx_r0.sidenavFixedInViewport$))("mode", (tmp_2_0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](7, 13, ctx_r0.sidenavMode$)) !== null && tmp_2_0 !== undefined ? tmp_2_0 : "side")("opened", !!_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](8, 15, ctx_r0.sidenavOpen$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("collapsed", !!_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](10, 17, ctx_r0.sidenavCollapsed$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("opened", !!_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](12, 19, ctx_r0.quickpanelOpen$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("dark", config_r1.layout === "vertical");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", config_r1.footer.visible);
  }
}
class LayoutComponent {
  constructor(layoutService, configService) {
    this.layoutService = layoutService;
    this.configService = configService;
    this.config$ = this.configService.config$;
    this.sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
    this.sidenavDisableClose$ = this.layoutService.isDesktop$;
    this.sidenavFixedInViewport$ = this.layoutService.isDesktop$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(isDesktop => !isDesktop));
    this.sidenavMode$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.layoutService.isDesktop$, this.configService.select(config => config.layout)]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(([isDesktop, layout]) => !isDesktop || layout === 'vertical' ? 'over' : 'side'));
    this.sidenavOpen$ = this.layoutService.sidenavOpen$;
    this.configPanelOpen$ = this.layoutService.configPanelOpen$;
    this.quickpanelOpen$ = this.layoutService.quickpanelOpen$;
  }
  onSidenavClosed() {
    this.layoutService.closeSidenav();
  }
  onQuickpanelClosed() {
    this.layoutService.closeQuickpanel();
  }
  static #_ = this.ɵfac = function LayoutComponent_Factory(t) {
    return new (t || LayoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_vex_services_vex_layout_service__WEBPACK_IMPORTED_MODULE_7__.VexLayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_vex_config_vex_config_service__WEBPACK_IMPORTED_MODULE_8__.VexConfigService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: LayoutComponent,
    selectors: [["vex-layout"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵStandaloneFeature"]],
    decls: 2,
    vars: 3,
    consts: [[4, "ngIf"], [1, "vex-layout-sidenav-container"], [3, "disableClose", "fixedInViewport", "mode", "opened", "closedStart"], [3, "collapsed"], ["mode", "over", "position", "end", 1, "vex-layout-quickpanel", 3, "opened", "closedStart"], [1, "vex-layout-sidenav-content"], [1, "vex-toolbar"], [1, "vex-layout-content"], ["class", "vex-footer", 4, "ngIf"], [1, "vex-footer"]],
    template: function LayoutComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](0, LayoutComponent_vex_base_layout_0_Template, 19, 21, "vex-base-layout", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](1, "async");
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](1, 1, ctx.config$));
      }
    },
    dependencies: [_base_layout_base_layout_component__WEBPACK_IMPORTED_MODULE_4__.BaseLayoutComponent, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.AsyncPipe, _components_sidenav_sidenav_component__WEBPACK_IMPORTED_MODULE_0__.SidenavComponent, _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_1__.ToolbarComponent, _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__.FooterComponent, _components_quickpanel_quickpanel_component__WEBPACK_IMPORTED_MODULE_3__.QuickpanelComponent, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_13__.MatDialogModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__.MatSidenavModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__.MatSidenav, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__.MatSidenavContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__.MatSidenavContent, _angular_router__WEBPACK_IMPORTED_MODULE_15__.RouterOutlet, _components_toolbar_search_search_component__WEBPACK_IMPORTED_MODULE_5__.SearchComponent, _vex_components_vex_progress_bar_vex_progress_bar_component__WEBPACK_IMPORTED_MODULE_6__.VexProgressBarComponent],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 20553:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'
};

/***/ }),

/***/ 14913:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.component */ 66401);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ 36480);
/* harmony import */ var _app_app_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/app.config */ 7110);



(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.bootstrapApplication)(_app_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent, _app_app_config__WEBPACK_IMPORTED_MODULE_1__.appConfig).catch(err => {
  // Error en bootstrap de la aplicación
});

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(14913)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map