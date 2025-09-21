"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_calendar_calendar_component_ts"],{

/***/ 74790:
/*!******************************************************************************!*\
  !*** ./src/app/pages/apps/calendar/calendar-edit/calendar-edit.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarEditComponent: () => (/* binding */ CalendarEditComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/datepicker */ 82226);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);













class CalendarEditComponent {
  constructor(dialogRef, event, fb) {
    this.dialogRef = dialogRef;
    this.event = event;
    this.fb = fb;
    this.form = this.fb.group({
      title: null,
      start: null,
      end: null
    });
  }
  ngOnInit() {
    this.form.patchValue(this.event);
  }
  save() {
    this.dialogRef.close({
      ...this.event,
      ...this.form.value
    });
  }
  static #_ = this.ɵfac = function CalendarEditComponent_Factory(t) {
    return new (t || CalendarEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.UntypedFormBuilder));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: CalendarEditComponent,
    selectors: [["vex-calendar-edit"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 28,
    vars: 6,
    consts: [["matDialogTitle", ""], [3, "formGroup"], [1, "flex", "flex-col"], ["formControlName", "title", "matInput", ""], ["formControlName", "start", "matInput", "", 3, "matDatepicker"], ["matIconSuffix", "", 3, "for"], ["startDatepicker", ""], ["formControlName", "end", "matInput", "", 3, "matDatepicker"], ["endDatepicker", ""], [1, "flex", "justify-end"], ["mat-button", "", "mat-dialog-close", ""], ["color", "primary", "mat-raised-button", "", 1, "save", 3, "click"]],
    template: function CalendarEditComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h3", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-dialog-content")(3, "form", 1)(4, "div", 2)(5, "mat-form-field")(6, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Event Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "input", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-form-field")(10, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Start Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "input", 4)(13, "mat-datepicker-toggle", 5)(14, "mat-datepicker", null, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "mat-form-field")(17, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "End Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "input", 7)(20, "mat-datepicker-toggle", 5)(21, "mat-datepicker", null, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "mat-dialog-actions", 9)(24, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CalendarEditComponent_Template_button_click_26_listener() {
          return ctx.save();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, " Save ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](15);
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.event.title, "\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matDatepicker", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matDatepicker", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", _r1);
      }
    },
    dependencies: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogClose, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogContent, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_3__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_3__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_3__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_3__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_4__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_4__.MatInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_5__.MatDatepickerModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_5__.MatDatepicker, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_5__.MatDatepickerInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_5__.MatDatepickerToggle, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 60894:
/*!***********************************************************!*\
  !*** ./src/app/pages/apps/calendar/calendar.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarComponent: () => (/* binding */ CalendarComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular-calendar */ 82882);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! date-fns */ 7902);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! date-fns */ 57016);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! date-fns */ 65822);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! date-fns */ 72775);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! date-fns */ 15870);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 52665);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! date-fns */ 77393);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! date-fns */ 4512);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _calendar_edit_calendar_edit_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./calendar-edit/calendar-edit.component */ 74790);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-scrollbar/vex-scrollbar.component */ 19844);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var angular_calendar_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! angular-calendar/date-adapters/date-fns */ 29689);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
















const _c0 = ["modalContent"];
function CalendarComponent_mwl_calendar_month_view_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-month-view", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dayClicked", function CalendarComponent_mwl_calendar_month_view_22_Template_mwl_calendar_month_view_dayClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r3.dayClicked($event.day));
    })("eventClicked", function CalendarComponent_mwl_calendar_month_view_22_Template_mwl_calendar_month_view_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r5.handleEvent("Clicked", $event.event));
    })("eventTimesChanged", function CalendarComponent_mwl_calendar_month_view_22_Template_mwl_calendar_month_view_eventTimesChanged_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r6.eventTimesChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("activeDayIsOpen", ctx_r0.activeDayIsOpen)("events", ctx_r0.events)("refresh", ctx_r0.refresh)("viewDate", ctx_r0.viewDate);
  }
}
function CalendarComponent_mwl_calendar_week_view_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarComponent_mwl_calendar_week_view_23_Template_mwl_calendar_week_view_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r7.handleEvent("Clicked", $event.event));
    })("eventTimesChanged", function CalendarComponent_mwl_calendar_week_view_23_Template_mwl_calendar_week_view_eventTimesChanged_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r8);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r9.eventTimesChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("events", ctx_r1.events)("refresh", ctx_r1.refresh)("viewDate", ctx_r1.viewDate);
  }
}
function CalendarComponent_mwl_calendar_day_view_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-day-view", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarComponent_mwl_calendar_day_view_24_Template_mwl_calendar_day_view_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r10.handleEvent("Clicked", $event.event));
    })("eventTimesChanged", function CalendarComponent_mwl_calendar_day_view_24_Template_mwl_calendar_day_view_eventTimesChanged_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r11);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r12.eventTimesChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("events", ctx_r2.events)("refresh", ctx_r2.refresh)("viewDate", ctx_r2.viewDate);
  }
}
const colors = {
  blue: {
    primary: '#5c77ff',
    secondary: '#FFFFFF'
  },
  yellow: {
    primary: '#ffc107',
    secondary: '#FDF1BA'
  },
  red: {
    primary: '#f44336',
    secondary: '#FFFFFF'
  }
};
class CalendarComponent {
  constructor(dialog, snackbar) {
    this.dialog = dialog;
    this.snackbar = snackbar;
    this.view = angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarView.Month;
    this.CalendarView = angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarView;
    this.viewDate = new Date();
    this.refresh = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
    this.actions = [{
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({
        event
      }) => {
        this.handleEvent('Edited', event);
      }
    }, {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({
        event
      }) => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }];
    this.events = [{
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_5__["default"])((0,date_fns__WEBPACK_IMPORTED_MODULE_6__["default"])(new Date()), 1),
      end: (0,date_fns__WEBPACK_IMPORTED_MODULE_7__["default"])(new Date(), 1),
      title: 'A 3 day event',
      // TODO: fix these colors
      //color: colors.primary,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }, {
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_6__["default"])(new Date()),
      title: 'An event with no end date',
      //color: colors.yellow,
      actions: this.actions
    }, {
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_5__["default"])((0,date_fns__WEBPACK_IMPORTED_MODULE_8__["default"])(new Date()), 3),
      end: (0,date_fns__WEBPACK_IMPORTED_MODULE_7__["default"])((0,date_fns__WEBPACK_IMPORTED_MODULE_8__["default"])(new Date()), 3),
      title: 'A long event that spans 2 months',
      //color: colors.primary,
      allDay: true
    }, {
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_9__["default"])((0,date_fns__WEBPACK_IMPORTED_MODULE_6__["default"])(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      //color: colors.red,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }];
    this.activeDayIsOpen = true;
  }
  dayClicked({
    date,
    events
  }) {
    if ((0,date_fns__WEBPACK_IMPORTED_MODULE_10__["default"])(date, this.viewDate)) {
      this.activeDayIsOpen = !((0,date_fns__WEBPACK_IMPORTED_MODULE_11__["default"])(this.viewDate, date) && this.activeDayIsOpen || events.length === 0);
      this.viewDate = date;
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }) {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }
  handleEvent(action, event) {
    const dialogRef = this.dialog.open(_calendar_edit_calendar_edit_component__WEBPACK_IMPORTED_MODULE_0__.CalendarEditComponent, {
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        event = result;
        this.snackbar.open('Updated Event: ' + event.title);
        this.refresh.next(null);
      }
    });
  }
  addEvent() {
    this.events = [...this.events, {
      title: 'New event',
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_6__["default"])(new Date()),
      end: (0,date_fns__WEBPACK_IMPORTED_MODULE_12__["default"])(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }];
  }
  deleteEvent(eventToDelete) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }
  setView(view) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  static #_ = this.ɵfac = function CalendarComponent_Factory(t) {
    return new (t || CalendarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_13__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: CalendarComponent,
    selectors: [["vex-calendar"]],
    viewQuery: function CalendarComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 7);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.modalContent = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵProvidersFeature"]([{
      provide: angular_calendar__WEBPACK_IMPORTED_MODULE_3__.DateAdapter,
      useFactory: angular_calendar_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_15__.adapterFactory
    }, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarEventTitleFormatter, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarDateFormatter, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarUtils, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarA11y]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 25,
    vars: 13,
    consts: [[1, "h-full", "flex", "flex-col"], [1, "calendar-bg", "relative", "text-white", "flex-none"], [1, "bg-black", "opacity-25", "absolute", "top-0", "left-0", "right-0", "bottom-0", "z-0", "w-full", "h-full"], [1, "container", "py-4", "px-6", "h-40", "z-10", "relative", "flex", "items-end"], [1, "flex-auto", "flex", "flex-col", "sm:flex-row", "justify-between", "items-center"], [1, "headline"], [1, "actions", "flex", "flex-col", "sm:flex-row", "justify-end", "items-center"], [1, "chevrons"], ["mat-icon-button", "", "mwlCalendarPreviousView", "", 3, "viewDate", "view", "viewDateChange"], ["svgIcon", "mat:chevron_left"], ["mat-icon-button", "", "mwlCalendarNextView", "", 3, "viewDate", "view", "viewDateChange"], ["svgIcon", "mat:chevron_right"], [1, "flex", "gap-1"], ["mat-button", "", 3, "click"], [1, "px-0", "shadow", "flex-auto", "relative", "container", 3, "ngSwitch"], [3, "activeDayIsOpen", "events", "refresh", "viewDate", "dayClicked", "eventClicked", "eventTimesChanged", 4, "ngSwitchCase"], [3, "events", "refresh", "viewDate", "eventClicked", "eventTimesChanged", 4, "ngSwitchCase"], [3, "activeDayIsOpen", "events", "refresh", "viewDate", "dayClicked", "eventClicked", "eventTimesChanged"], [3, "events", "refresh", "viewDate", "eventClicked", "eventTimesChanged"]],
    template: function CalendarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3)(4, "div", 4)(5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](7, "calendarDate");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 6)(9, "div", 7)(10, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("viewDateChange", function CalendarComponent_Template_button_viewDateChange_10_listener($event) {
          return ctx.viewDate = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "mat-icon", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("viewDateChange", function CalendarComponent_Template_button_viewDateChange_12_listener($event) {
          return ctx.viewDate = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 12)(15, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarComponent_Template_button_click_15_listener() {
          return ctx.view = ctx.CalendarView.Month;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, " Month ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarComponent_Template_button_click_17_listener() {
          return ctx.view = ctx.CalendarView.Week;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Week");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarComponent_Template_button_click_19_listener() {
          return ctx.view = ctx.CalendarView.Day;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Day");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "vex-scrollbar", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](22, CalendarComponent_mwl_calendar_month_view_22_Template, 1, 4, "mwl-calendar-month-view", 15)(23, CalendarComponent_mwl_calendar_week_view_23_Template, 1, 3, "mwl-calendar-week-view", 16)(24, CalendarComponent_mwl_calendar_day_view_24_Template, 1, 3, "mwl-calendar-day-view", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](7, 9, ctx.viewDate, ctx.view + "ViewTitle", "en"), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("viewDate", ctx.viewDate)("view", ctx.view);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("viewDate", ctx.viewDate)("view", ctx.view);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitch", ctx.view);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "month");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "week");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "day");
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_16__.MatIconButton, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarCommonModule, angular_calendar__WEBPACK_IMPORTED_MODULE_3__["ɵCalendarPreviousViewDirective"], angular_calendar__WEBPACK_IMPORTED_MODULE_3__["ɵCalendarNextViewDirective"], angular_calendar__WEBPACK_IMPORTED_MODULE_3__["ɵCalendarDatePipe"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_17__.MatIcon, _vex_components_vex_scrollbar_vex_scrollbar_component__WEBPACK_IMPORTED_MODULE_1__.VexScrollbarComponent, _angular_common__WEBPACK_IMPORTED_MODULE_18__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_18__.NgSwitchCase, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarMonthModule, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarMonthViewComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarWeekModule, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarWeekViewComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarDayModule, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarDayViewComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_3__.CalendarModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__.MatSnackBarModule],
    styles: ["@charset \"UTF-8\";\n.cal-month-view .cal-header {\n  text-align: center;\n  font-weight: bolder;\n}\n.cal-month-view .cal-header .cal-cell {\n  padding: 5px 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n  white-space: nowrap;\n}\n.cal-month-view .cal-days {\n  border: 1px solid;\n  border-bottom: 0;\n}\n.cal-month-view .cal-cell-top {\n  min-height: 78px;\n  flex: 1;\n}\n.cal-month-view .cal-cell-row {\n  display: flex;\n}\n.cal-month-view .cal-cell {\n  float: left;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n}\n.cal-month-view .cal-cell .cal-event {\n  pointer-events: all !important;\n}\n.cal-month-view .cal-day-cell {\n  min-height: 100px;\n}\n.cal-month-view .cal-day-cell:not(:last-child) {\n  border-right: 1px solid;\n}\n[dir=rtl] .cal-month-view .cal-day-cell:not(:last-child) {\n  border-right: initial;\n  border-left: 1px solid;\n}\n.cal-month-view .cal-days .cal-cell-row {\n  border-bottom: 1px solid;\n}\n.cal-month-view .cal-day-badge {\n  margin-top: 18px;\n  margin-left: 10px;\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  border-radius: 10px;\n  float: left;\n}\n.cal-month-view .cal-day-number {\n  font-size: 1.2em;\n  font-weight: 400;\n  opacity: 0.5;\n  margin-top: 15px;\n  margin-right: 15px;\n  float: right;\n  margin-bottom: 10px;\n}\n.cal-month-view .cal-events {\n  flex: 1;\n  align-items: flex-end;\n  margin: 3px;\n  line-height: 10px;\n  display: flex;\n  flex-wrap: wrap;\n}\n.cal-month-view .cal-event {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  display: inline-block;\n  margin: 2px;\n}\n.cal-month-view .cal-day-cell.cal-in-month.cal-has-events {\n  cursor: pointer;\n}\n.cal-month-view .cal-day-cell.cal-out-month .cal-day-number {\n  opacity: 0.1;\n  cursor: default;\n}\n.cal-month-view .cal-day-cell.cal-today .cal-day-number {\n  font-size: 1.9em;\n}\n.cal-month-view .cal-open-day-events {\n  padding: 15px;\n}\n.cal-month-view .cal-open-day-events .cal-event {\n  position: relative;\n  top: 2px;\n}\n.cal-month-view .cal-out-month .cal-day-badge,\n.cal-month-view .cal-out-month .cal-event {\n  opacity: 0.3;\n}\n.cal-month-view .cal-draggable {\n  cursor: move;\n}\n.cal-month-view .cal-drag-active * {\n  pointer-events: none;\n}\n.cal-month-view .cal-event-title {\n  cursor: pointer;\n}\n.cal-month-view .cal-event-title:hover {\n  text-decoration: underline;\n}\n\n.cal-month-view {\n  background-color: #fff;\n}\n.cal-month-view .cal-cell-row:hover {\n  background-color: #fafafa;\n}\n.cal-month-view .cal-cell-row .cal-cell:hover,\n.cal-month-view .cal-cell.cal-has-events.cal-open {\n  background-color: #ededed;\n}\n.cal-month-view .cal-days {\n  border-color: #e1e1e1;\n}\n.cal-month-view .cal-day-cell:not(:last-child) {\n  border-right-color: #e1e1e1;\n}\n[dir=rtl] .cal-month-view .cal-day-cell:not(:last-child) {\n  border-right-color: initial;\n  border-left-color: #e1e1e1;\n}\n.cal-month-view .cal-days .cal-cell-row {\n  border-bottom-color: #e1e1e1;\n}\n.cal-month-view .cal-day-badge {\n  background-color: #b94a48;\n  color: #fff;\n}\n.cal-month-view .cal-event {\n  background-color: #1e90ff;\n  border-color: #d1e8ff;\n  color: #fff;\n}\n.cal-month-view .cal-day-cell.cal-weekend .cal-day-number {\n  color: #8b0000;\n}\n.cal-month-view .cal-day-cell.cal-today {\n  background-color: #e8fde7;\n}\n.cal-month-view .cal-day-cell.cal-drag-over {\n  background-color: #e0e0e0 !important;\n}\n.cal-month-view .cal-open-day-events {\n  color: #fff;\n  background-color: #555;\n  box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.5);\n}\n\n.cal-week-view {\n  /* stylelint-disable-next-line selector-type-no-unknown */\n}\n.cal-week-view * {\n  box-sizing: border-box;\n}\n.cal-week-view .cal-day-headers {\n  display: flex;\n  padding-left: 70px;\n  border: 1px solid;\n}\n[dir=rtl] .cal-week-view .cal-day-headers {\n  padding-left: initial;\n  padding-right: 70px;\n}\n.cal-week-view .cal-day-headers .cal-header {\n  flex: 1;\n  text-align: center;\n  padding: 5px;\n}\n.cal-week-view .cal-day-headers .cal-header:not(:last-child) {\n  border-right: 1px solid;\n}\n[dir=rtl] .cal-week-view .cal-day-headers .cal-header:not(:last-child) {\n  border-right: initial;\n  border-left: 1px solid;\n}\n.cal-week-view .cal-day-headers .cal-header:first-child {\n  border-left: 1px solid;\n}\n[dir=rtl] .cal-week-view .cal-day-headers .cal-header:first-child {\n  border-left: initial;\n  border-right: 1px solid;\n}\n.cal-week-view .cal-day-headers span {\n  font-weight: 400;\n  opacity: 0.5;\n}\n.cal-week-view .cal-day-column {\n  flex-grow: 1;\n  border-left: solid 1px;\n}\n[dir=rtl] .cal-week-view .cal-day-column {\n  border-left: initial;\n  border-right: solid 1px;\n}\n.cal-week-view .cal-event {\n  font-size: 12px;\n  border: 1px solid;\n  direction: ltr;\n}\n.cal-week-view .cal-time-label-column {\n  width: 70px;\n  height: 100%;\n}\n.cal-week-view .cal-current-time-marker {\n  position: absolute;\n  width: 100%;\n  height: 2px;\n  z-index: 2;\n}\n.cal-week-view .cal-all-day-events {\n  border: solid 1px;\n  border-top: 0;\n  border-bottom-width: 3px;\n  padding-top: 3px;\n  position: relative;\n}\n.cal-week-view .cal-all-day-events .cal-day-columns {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.cal-week-view .cal-all-day-events .cal-events-row {\n  position: relative;\n  height: 31px;\n  margin-left: 70px;\n}\n[dir=rtl] .cal-week-view .cal-all-day-events .cal-events-row {\n  margin-left: initial;\n  margin-right: 70px;\n}\n.cal-week-view .cal-all-day-events .cal-event-container {\n  display: inline-block;\n  position: absolute;\n}\n.cal-week-view .cal-all-day-events .cal-event-container.resize-active {\n  z-index: 1;\n  pointer-events: none;\n}\n.cal-week-view .cal-all-day-events .cal-event {\n  padding: 0 5px;\n  margin-left: 2px;\n  margin-right: 2px;\n  height: 28px;\n  line-height: 28px;\n}\n.cal-week-view .cal-all-day-events .cal-starts-within-week .cal-event {\n  border-top-left-radius: 5px;\n  border-bottom-left-radius: 5px;\n}\n[dir=rtl] .cal-week-view .cal-all-day-events .cal-starts-within-week .cal-event {\n  border-top-left-radius: initial;\n  border-bottom-left-radius: initial;\n  border-top-right-radius: 5px !important;\n  border-bottom-right-radius: 5px !important;\n}\n.cal-week-view .cal-all-day-events .cal-ends-within-week .cal-event {\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px;\n}\n[dir=rtl] .cal-week-view .cal-all-day-events .cal-ends-within-week .cal-event {\n  border-top-right-radius: initial;\n  border-bottom-right-radius: initial;\n  border-top-left-radius: 5px;\n  border-bottom-left-radius: 5px;\n}\n.cal-week-view .cal-all-day-events .cal-time-label-column {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}\n.cal-week-view .cal-all-day-events .cal-resize-handle {\n  width: 6px;\n  height: 100%;\n  cursor: col-resize;\n  position: absolute;\n  top: 0;\n}\n.cal-week-view .cal-all-day-events .cal-resize-handle.cal-resize-handle-after-end {\n  right: 0;\n}\n[dir=rtl] .cal-week-view .cal-all-day-events .cal-resize-handle.cal-resize-handle-after-end {\n  right: initial;\n  left: 0;\n}\n.cal-week-view .cal-event,\n.cal-week-view .cal-header {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.cal-week-view .cal-drag-active {\n  pointer-events: none;\n  z-index: 1;\n}\n.cal-week-view .cal-drag-active * {\n  pointer-events: none;\n}\n.cal-week-view .cal-time-events {\n  position: relative;\n  border: solid 1px;\n  border-top: 0;\n  display: flex;\n}\n.cal-week-view .cal-time-events .cal-day-columns {\n  display: flex;\n  flex-grow: 1;\n}\n.cal-week-view .cal-time-events .cal-day-column {\n  position: relative;\n}\n.cal-week-view .cal-time-events .cal-events-container {\n  position: relative;\n}\n.cal-week-view .cal-time-events .cal-event-container {\n  position: absolute;\n  z-index: 1;\n}\n.cal-week-view .cal-time-events .cal-event {\n  width: calc(100% - 2px);\n  height: calc(100% - 2px);\n  margin: 1px;\n  padding: 0 5px;\n  line-height: 25px;\n}\n.cal-week-view .cal-time-events .cal-resize-handle {\n  width: 100%;\n  height: 4px;\n  cursor: row-resize;\n  position: absolute;\n}\n.cal-week-view .cal-time-events .cal-resize-handle.cal-resize-handle-after-end {\n  bottom: 0;\n}\n.cal-week-view .cal-hour-segment {\n  position: relative;\n}\n.cal-week-view .cal-hour-segment::after {\n  content: \"\u00A0\";\n}\n.cal-week-view .cal-event-container:not(.cal-draggable) {\n  cursor: pointer;\n}\n.cal-week-view .cal-draggable {\n  cursor: move;\n}\n.cal-week-view mwl-calendar-week-view-hour-segment,\n.cal-week-view .cal-hour-segment {\n  display: block;\n}\n.cal-week-view .cal-hour:not(:last-child) .cal-hour-segment,\n.cal-week-view .cal-hour:last-child :not(:last-child) .cal-hour-segment {\n  border-bottom: thin dashed;\n}\n.cal-week-view .cal-time {\n  font-weight: bold;\n  padding-top: 5px;\n  width: 70px;\n  text-align: center;\n}\n.cal-week-view .cal-hour-segment.cal-after-hour-start .cal-time {\n  display: none;\n}\n.cal-week-view .cal-starts-within-day .cal-event {\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n}\n.cal-week-view .cal-ends-within-day .cal-event {\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n}\n\n.cal-week-view {\n  background-color: #fff;\n  border-top: solid 1px #e1e1e1;\n}\n.cal-week-view .cal-day-headers {\n  border-color: #e1e1e1;\n  border-top: 0;\n}\n.cal-week-view .cal-day-headers .cal-header:not(:last-child) {\n  border-right-color: #e1e1e1;\n}\n[dir=rtl] .cal-week-view .cal-day-headers .cal-header:not(:last-child) {\n  border-right-color: initial;\n  border-left: solid 1px #e1e1e1 !important;\n}\n.cal-week-view .cal-day-headers .cal-header:first-child {\n  border-left-color: #e1e1e1;\n}\n[dir=rtl] .cal-week-view .cal-day-headers .cal-header:first-child {\n  border-left-color: initial;\n  border-right-color: #e1e1e1;\n}\n.cal-week-view .cal-day-headers .cal-header:hover,\n.cal-week-view .cal-day-headers .cal-drag-over {\n  background-color: #ededed;\n}\n.cal-week-view .cal-day-column {\n  border-left-color: #e1e1e1;\n}\n[dir=rtl] .cal-week-view .cal-day-column {\n  border-left-color: initial;\n  border-right-color: #e1e1e1;\n}\n.cal-week-view .cal-event {\n  background-color: #d1e8ff;\n  border-color: #1e90ff;\n  color: #1e90ff;\n}\n.cal-week-view .cal-all-day-events {\n  border-color: #e1e1e1;\n}\n.cal-week-view .cal-header.cal-today {\n  background-color: #e8fde7;\n}\n.cal-week-view .cal-header.cal-weekend span {\n  color: #8b0000;\n}\n.cal-week-view .cal-time-events {\n  border-color: #e1e1e1;\n}\n.cal-week-view .cal-time-events .cal-day-columns:not(.cal-resize-active) .cal-hour-segment:hover {\n  background-color: #ededed;\n}\n.cal-week-view .cal-hour-odd {\n  background-color: #fafafa;\n}\n.cal-week-view .cal-drag-over .cal-hour-segment {\n  background-color: #ededed;\n}\n.cal-week-view .cal-hour:not(:last-child) .cal-hour-segment,\n.cal-week-view .cal-hour:last-child :not(:last-child) .cal-hour-segment {\n  border-bottom-color: #e1e1e1;\n}\n.cal-week-view .cal-current-time-marker {\n  background-color: #ea4334;\n}\n\n.cal-day-view {\n  /* stylelint-disable-next-line selector-type-no-unknown */\n}\n.cal-day-view mwl-calendar-week-view-header {\n  display: none;\n}\n.cal-day-view .cal-events-container {\n  margin-left: 70px;\n}\n[dir=rtl] .cal-day-view .cal-events-container {\n  margin-left: initial;\n  margin-right: 70px;\n}\n.cal-day-view .cal-day-column {\n  border-left: 0;\n}\n.cal-day-view .cal-current-time-marker {\n  margin-left: 70px;\n  width: calc(100% - 70px);\n}\n[dir=rtl] .cal-day-view .cal-current-time-marker {\n  margin-left: initial;\n  margin-right: 70px;\n}\n\n.cal-tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.5;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  font-size: 11px;\n  word-wrap: break-word;\n  opacity: 0.9;\n}\n\n.cal-tooltip.cal-tooltip-top {\n  padding: 5px 0;\n  margin-top: -3px;\n}\n\n.cal-tooltip.cal-tooltip-top .cal-tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n}\n\n.cal-tooltip.cal-tooltip-right {\n  padding: 0 5px;\n  margin-left: 3px;\n}\n\n.cal-tooltip.cal-tooltip-right .cal-tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n}\n\n.cal-tooltip.cal-tooltip-bottom {\n  padding: 5px 0;\n  margin-top: 3px;\n}\n\n.cal-tooltip.cal-tooltip-bottom .cal-tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n}\n\n.cal-tooltip.cal-tooltip-left {\n  padding: 0 5px;\n  margin-left: -3px;\n}\n\n.cal-tooltip.cal-tooltip-left .cal-tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n}\n\n.cal-tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  text-align: center;\n  border-radius: 0.25rem;\n}\n\n.cal-tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n\n.cal-tooltip.cal-tooltip-top .cal-tooltip-arrow {\n  border-top-color: #000;\n}\n\n.cal-tooltip.cal-tooltip-right .cal-tooltip-arrow {\n  border-right-color: #000;\n}\n\n.cal-tooltip.cal-tooltip-bottom .cal-tooltip-arrow {\n  border-bottom-color: #000;\n}\n\n.cal-tooltip.cal-tooltip-left .cal-tooltip-arrow {\n  border-left-color: #000;\n}\n\n.cal-tooltip-inner {\n  color: #fff;\n  background-color: #000;\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL25vZGVfbW9kdWxlcy9hbmd1bGFyLWNhbGVuZGFyL2Nzcy9hbmd1bGFyLWNhbGVuZGFyLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUFDaEI7RUFDRSxrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBRWIsdUJBQXVCO0VBQzFCLGNBQWM7RUFDZCxtQkFBbUI7QUFDckI7QUFDQTtFQUNFLGlCQUFpQjtFQUNqQixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGdCQUFnQjtFQUdSLE9BQU87QUFDakI7QUFDQTtFQUdFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsV0FBVztFQUdILE9BQU87RUFHZixhQUFhO0VBSUwsc0JBQXNCO0VBR3RCLG9CQUFvQjtBQUM5QjtBQUNBO0VBQ0UsOEJBQThCO0FBQ2hDO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLHVCQUF1QjtBQUN6QjtBQUNBO0VBQ0UscUJBQXFCO0VBQ3JCLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0Usd0JBQXdCO0FBQzFCO0FBQ0E7RUFDRSxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLHFCQUFxQjtFQUNyQixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixXQUFXO0FBQ2I7QUFDQTtFQUNFLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsWUFBWTtFQUNaLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLG1CQUFtQjtBQUNyQjtBQUNBO0VBR1UsT0FBTztFQUdQLHFCQUFxQjtFQUM3QixXQUFXO0VBQ1gsaUJBQWlCO0VBR2pCLGFBQWE7RUFFVCxlQUFlO0FBQ3JCO0FBQ0E7RUFDRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsV0FBVztBQUNiO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxZQUFZO0VBQ1osZUFBZTtBQUNqQjtBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixRQUFRO0FBQ1Y7QUFDQTs7RUFFRSxZQUFZO0FBQ2Q7QUFDQTtFQUNFLFlBQVk7QUFDZDtBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSwwQkFBMEI7QUFDNUI7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQjtBQUNBOztFQUVFLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSwyQkFBMkI7QUFDN0I7QUFDQTtFQUNFLDJCQUEyQjtFQUMzQiwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLFdBQVc7QUFDYjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLHFCQUFxQjtFQUNyQixXQUFXO0FBQ2I7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0Usb0NBQW9DO0FBQ3RDO0FBQ0E7RUFDRSxXQUFXO0VBQ1gsc0JBQXNCO0VBRWQsK0NBQStDO0FBQ3pEOztBQUVBO0VBQ0UseURBQXlEO0FBQzNEO0FBQ0E7RUFFVSxzQkFBc0I7QUFDaEM7QUFDQTtFQUdFLGFBQWE7RUFDYixrQkFBa0I7RUFDbEIsaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxxQkFBcUI7RUFDckIsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFHVSxPQUFPO0VBQ2Ysa0JBQWtCO0VBQ2xCLFlBQVk7QUFDZDtBQUNBO0VBQ0UsdUJBQXVCO0FBQ3pCO0FBQ0E7RUFDRSxxQkFBcUI7RUFDckIsc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSxzQkFBc0I7QUFDeEI7QUFDQTtFQUNFLG9CQUFvQjtFQUNwQix1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGdCQUFnQjtFQUNoQixZQUFZO0FBQ2Q7QUFDQTtFQUdVLFlBQVk7RUFDcEIsc0JBQXNCO0FBQ3hCO0FBQ0E7RUFDRSxvQkFBb0I7RUFDcEIsdUJBQXVCO0FBQ3pCO0FBQ0E7RUFDRSxlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLGNBQWM7QUFDaEI7QUFDQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsV0FBVztFQUNYLFVBQVU7QUFDWjtBQUNBO0VBQ0UsaUJBQWlCO0VBQ2pCLGFBQWE7RUFDYix3QkFBd0I7RUFDeEIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsWUFBWTtFQUNaLFdBQVc7RUFHWCxhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLE1BQU07RUFDTixVQUFVO0FBQ1o7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSxvQkFBb0I7RUFDcEIsa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxxQkFBcUI7RUFDckIsa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxVQUFVO0VBQ1Ysb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixZQUFZO0VBQ1osaUJBQWlCO0FBQ25CO0FBQ0E7RUFDRSwyQkFBMkI7RUFDM0IsOEJBQThCO0FBQ2hDO0FBQ0E7RUFDRSwrQkFBK0I7RUFDL0Isa0NBQWtDO0VBQ2xDLHVDQUF1QztFQUN2QywwQ0FBMEM7QUFDNUM7QUFDQTtFQUNFLDRCQUE0QjtFQUM1QiwrQkFBK0I7QUFDakM7QUFDQTtFQUNFLGdDQUFnQztFQUNoQyxtQ0FBbUM7RUFDbkMsMkJBQTJCO0VBQzNCLDhCQUE4QjtBQUNoQztBQUNBO0VBR0UsYUFBYTtFQUdMLG1CQUFtQjtFQUduQix1QkFBdUI7RUFDL0IsZUFBZTtBQUNqQjtBQUNBO0VBQ0UsVUFBVTtFQUNWLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLE1BQU07QUFDUjtBQUNBO0VBQ0UsUUFBUTtBQUNWO0FBQ0E7RUFDRSxjQUFjO0VBQ2QsT0FBTztBQUNUO0FBQ0E7O0VBRUUsZ0JBQWdCO0VBRWIsdUJBQXVCO0VBQzFCLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0Usb0JBQW9CO0VBQ3BCLFVBQVU7QUFDWjtBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxrQkFBa0I7RUFDbEIsaUJBQWlCO0VBQ2pCLGFBQWE7RUFHYixhQUFhO0FBQ2Y7QUFDQTtFQUdFLGFBQWE7RUFHTCxZQUFZO0FBQ3RCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLFVBQVU7QUFDWjtBQUNBO0VBQ0UsdUJBQXVCO0VBQ3ZCLHdCQUF3QjtFQUN4QixXQUFXO0VBQ1gsY0FBYztFQUNkLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsV0FBVztFQUNYLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxTQUFTO0FBQ1g7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsWUFBWTtBQUNkO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxZQUFZO0FBQ2Q7QUFDQTs7RUFFRSxjQUFjO0FBQ2hCO0FBQ0E7O0VBRUUsMEJBQTBCO0FBQzVCO0FBQ0E7RUFDRSxpQkFBaUI7RUFDakIsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsMkJBQTJCO0VBQzNCLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UsOEJBQThCO0VBQzlCLCtCQUErQjtBQUNqQzs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0Qiw2QkFBNkI7QUFDL0I7QUFDQTtFQUNFLHFCQUFxQjtFQUNyQixhQUFhO0FBQ2Y7QUFDQTtFQUNFLDJCQUEyQjtBQUM3QjtBQUNBO0VBQ0UsMkJBQTJCO0VBQzNCLHlDQUF5QztBQUMzQztBQUNBO0VBQ0UsMEJBQTBCO0FBQzVCO0FBQ0E7RUFDRSwwQkFBMEI7RUFDMUIsMkJBQTJCO0FBQzdCO0FBQ0E7O0VBRUUseUJBQXlCO0FBQzNCO0FBQ0E7RUFDRSwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLDBCQUEwQjtFQUMxQiwyQkFBMkI7QUFDN0I7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsY0FBYztBQUNoQjtBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0UseUJBQXlCO0FBQzNCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQjtBQUNBOztFQUVFLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UseURBQXlEO0FBQzNEO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0Usb0JBQW9CO0VBQ3BCLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBO0VBQ0UsaUJBQWlCO0VBQ2pCLHdCQUF3QjtBQUMxQjtBQUNBO0VBQ0Usb0JBQW9CO0VBQ3BCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2IsY0FBYztFQUNkLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLHFCQUFxQjtFQUNyQixpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsb0JBQW9CO0VBQ3BCLGVBQWU7RUFDZixxQkFBcUI7RUFDckIsWUFBWTtBQUNkOztBQUVBO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLFNBQVM7RUFDVCxTQUFTO0VBQ1QsaUJBQWlCO0VBQ2pCLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxRQUFRO0VBQ1IsT0FBTztFQUNQLGdCQUFnQjtFQUNoQiwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLE1BQU07RUFDTixTQUFTO0VBQ1QsaUJBQWlCO0VBQ2pCLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxRQUFRO0VBQ1IsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQiwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtFQUNsQixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFNBQVM7RUFDVCx5QkFBeUI7RUFDekIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsV0FBVztFQUNYLHNCQUFzQjtBQUN4QiIsInNvdXJjZXNDb250ZW50IjpbIkBjaGFyc2V0IFwiVVRGLThcIjtcbi5jYWwtbW9udGgtdmlldyAuY2FsLWhlYWRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWhlYWRlciAuY2FsLWNlbGwge1xuICBwYWRkaW5nOiA1cHggMDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgLW8tdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWRheXMge1xuICBib3JkZXI6IDFweCBzb2xpZDtcbiAgYm9yZGVyLWJvdHRvbTogMDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWNlbGwtdG9wIHtcbiAgbWluLWhlaWdodDogNzhweDtcbiAgLXdlYmtpdC1ib3gtZmxleDogMTtcbiAgICAgIC1tcy1mbGV4OiAxO1xuICAgICAgICAgIGZsZXg6IDE7XG59XG4uY2FsLW1vbnRoLXZpZXcgLmNhbC1jZWxsLXJvdyB7XG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcbiAgZGlzcGxheTogZmxleDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWNlbGwge1xuICBmbG9hdDogbGVmdDtcbiAgLXdlYmtpdC1ib3gtZmxleDogMTtcbiAgICAgIC1tcy1mbGV4OiAxO1xuICAgICAgICAgIGZsZXg6IDE7XG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcbiAgZGlzcGxheTogZmxleDtcbiAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcbiAgLXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XG4gICAgICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAtd2Via2l0LWJveC1hbGlnbjogc3RyZXRjaDtcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBzdHJldGNoO1xuICAgICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtY2VsbCAuY2FsLWV2ZW50IHtcbiAgcG9pbnRlci1ldmVudHM6IGFsbCAhaW1wb3J0YW50O1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LWNlbGwge1xuICBtaW4taGVpZ2h0OiAxMDBweDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWRheS1jZWxsOm5vdCg6bGFzdC1jaGlsZCkge1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZDtcbn1cbltkaXI9cnRsXSAuY2FsLW1vbnRoLXZpZXcgLmNhbC1kYXktY2VsbDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLXJpZ2h0OiBpbml0aWFsO1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5cyAuY2FsLWNlbGwtcm93IHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LWJhZGdlIHtcbiAgbWFyZ2luLXRvcDogMThweDtcbiAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWluLXdpZHRoOiAxMHB4O1xuICBwYWRkaW5nOiAzcHggN3B4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGZsb2F0OiBsZWZ0O1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LW51bWJlciB7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIG9wYWNpdHk6IDAuNTtcbiAgbWFyZ2luLXRvcDogMTVweDtcbiAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xuICBmbG9hdDogcmlnaHQ7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG59XG4uY2FsLW1vbnRoLXZpZXcgLmNhbC1ldmVudHMge1xuICAtd2Via2l0LWJveC1mbGV4OiAxO1xuICAgICAgLW1zLWZsZXg6IDE7XG4gICAgICAgICAgZmxleDogMTtcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGVuZDtcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBlbmQ7XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBtYXJnaW46IDNweDtcbiAgbGluZS1oZWlnaHQ6IDEwcHg7XG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcbiAgZGlzcGxheTogZmxleDtcbiAgLW1zLWZsZXgtd3JhcDogd3JhcDtcbiAgICAgIGZsZXgtd3JhcDogd3JhcDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWV2ZW50IHtcbiAgd2lkdGg6IDEwcHg7XG4gIGhlaWdodDogMTBweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbjogMnB4O1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LWNlbGwuY2FsLWluLW1vbnRoLmNhbC1oYXMtZXZlbnRzIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LWNlbGwuY2FsLW91dC1tb250aCAuY2FsLWRheS1udW1iZXIge1xuICBvcGFjaXR5OiAwLjE7XG4gIGN1cnNvcjogZGVmYXVsdDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWRheS1jZWxsLmNhbC10b2RheSAuY2FsLWRheS1udW1iZXIge1xuICBmb250LXNpemU6IDEuOWVtO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtb3Blbi1kYXktZXZlbnRzIHtcbiAgcGFkZGluZzogMTVweDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLW9wZW4tZGF5LWV2ZW50cyAuY2FsLWV2ZW50IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0b3A6IDJweDtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLW91dC1tb250aCAuY2FsLWRheS1iYWRnZSxcbi5jYWwtbW9udGgtdmlldyAuY2FsLW91dC1tb250aCAuY2FsLWV2ZW50IHtcbiAgb3BhY2l0eTogMC4zO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZHJhZ2dhYmxlIHtcbiAgY3Vyc29yOiBtb3ZlO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZHJhZy1hY3RpdmUgKiB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZXZlbnQtdGl0bGUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uY2FsLW1vbnRoLXZpZXcgLmNhbC1ldmVudC10aXRsZTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4uY2FsLW1vbnRoLXZpZXcge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtY2VsbC1yb3c6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYWZhO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtY2VsbC1yb3cgLmNhbC1jZWxsOmhvdmVyLFxuLmNhbC1tb250aC12aWV3IC5jYWwtY2VsbC5jYWwtaGFzLWV2ZW50cy5jYWwtb3BlbiB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZGVkZWQ7XG59XG4uY2FsLW1vbnRoLXZpZXcgLmNhbC1kYXlzIHtcbiAgYm9yZGVyLWNvbG9yOiAjZTFlMWUxO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LWNlbGw6bm90KDpsYXN0LWNoaWxkKSB7XG4gIGJvcmRlci1yaWdodC1jb2xvcjogI2UxZTFlMTtcbn1cbltkaXI9cnRsXSAuY2FsLW1vbnRoLXZpZXcgLmNhbC1kYXktY2VsbDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiBpbml0aWFsO1xuICBib3JkZXItbGVmdC1jb2xvcjogI2UxZTFlMTtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWRheXMgLmNhbC1jZWxsLXJvdyB7XG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICNlMWUxZTE7XG59XG4uY2FsLW1vbnRoLXZpZXcgLmNhbC1kYXktYmFkZ2Uge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjk0YTQ4O1xuICBjb2xvcjogI2ZmZjtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWV2ZW50IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzFlOTBmZjtcbiAgYm9yZGVyLWNvbG9yOiAjZDFlOGZmO1xuICBjb2xvcjogI2ZmZjtcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWRheS1jZWxsLmNhbC13ZWVrZW5kIC5jYWwtZGF5LW51bWJlciB7XG4gIGNvbG9yOiAjOGIwMDAwO1xufVxuLmNhbC1tb250aC12aWV3IC5jYWwtZGF5LWNlbGwuY2FsLXRvZGF5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U4ZmRlNztcbn1cbi5jYWwtbW9udGgtdmlldyAuY2FsLWRheS1jZWxsLmNhbC1kcmFnLW92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTBlMGUwICFpbXBvcnRhbnQ7XG59XG4uY2FsLW1vbnRoLXZpZXcgLmNhbC1vcGVuLWRheS1ldmVudHMge1xuICBjb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzU1NTtcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgMTVweCAwIHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICAgICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTVweCAwIHJnYmEoMCwgMCwgMCwgMC41KTtcbn1cblxuLmNhbC13ZWVrLXZpZXcge1xuICAvKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc2VsZWN0b3ItdHlwZS1uby11bmtub3duICovXG59XG4uY2FsLXdlZWstdmlldyAqIHtcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWRheS1oZWFkZXJzIHtcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nLWxlZnQ6IDcwcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkO1xufVxuW2Rpcj1ydGxdIC5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWhlYWRlcnMge1xuICBwYWRkaW5nLWxlZnQ6IGluaXRpYWw7XG4gIHBhZGRpbmctcmlnaHQ6IDcwcHg7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWRheS1oZWFkZXJzIC5jYWwtaGVhZGVyIHtcbiAgLXdlYmtpdC1ib3gtZmxleDogMTtcbiAgICAgIC1tcy1mbGV4OiAxO1xuICAgICAgICAgIGZsZXg6IDE7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZzogNXB4O1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1kYXktaGVhZGVycyAuY2FsLWhlYWRlcjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQ7XG59XG5bZGlyPXJ0bF0gLmNhbC13ZWVrLXZpZXcgLmNhbC1kYXktaGVhZGVycyAuY2FsLWhlYWRlcjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLXJpZ2h0OiBpbml0aWFsO1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1kYXktaGVhZGVycyAuY2FsLWhlYWRlcjpmaXJzdC1jaGlsZCB7XG4gIGJvcmRlci1sZWZ0OiAxcHggc29saWQ7XG59XG5bZGlyPXJ0bF0gLmNhbC13ZWVrLXZpZXcgLmNhbC1kYXktaGVhZGVycyAuY2FsLWhlYWRlcjpmaXJzdC1jaGlsZCB7XG4gIGJvcmRlci1sZWZ0OiBpbml0aWFsO1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZDtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWhlYWRlcnMgc3BhbiB7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIG9wYWNpdHk6IDAuNTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWNvbHVtbiB7XG4gIC13ZWJraXQtYm94LWZsZXg6IDE7XG4gICAgICAtbXMtZmxleC1wb3NpdGl2ZTogMTtcbiAgICAgICAgICBmbGV4LWdyb3c6IDE7XG4gIGJvcmRlci1sZWZ0OiBzb2xpZCAxcHg7XG59XG5bZGlyPXJ0bF0gLmNhbC13ZWVrLXZpZXcgLmNhbC1kYXktY29sdW1uIHtcbiAgYm9yZGVyLWxlZnQ6IGluaXRpYWw7XG4gIGJvcmRlci1yaWdodDogc29saWQgMXB4O1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1ldmVudCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgYm9yZGVyOiAxcHggc29saWQ7XG4gIGRpcmVjdGlvbjogbHRyO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC10aW1lLWxhYmVsLWNvbHVtbiB7XG4gIHdpZHRoOiA3MHB4O1xuICBoZWlnaHQ6IDEwMCU7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWN1cnJlbnQtdGltZS1tYXJrZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDJweDtcbiAgei1pbmRleDogMjtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtYWxsLWRheS1ldmVudHMge1xuICBib3JkZXI6IHNvbGlkIDFweDtcbiAgYm9yZGVyLXRvcDogMDtcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogM3B4O1xuICBwYWRkaW5nLXRvcDogM3B4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWFsbC1kYXktZXZlbnRzIC5jYWwtZGF5LWNvbHVtbnMge1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICB6LWluZGV4OiAwO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLWV2ZW50cy1yb3cge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGhlaWdodDogMzFweDtcbiAgbWFyZ2luLWxlZnQ6IDcwcHg7XG59XG5bZGlyPXJ0bF0gLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLWV2ZW50cy1yb3cge1xuICBtYXJnaW4tbGVmdDogaW5pdGlhbDtcbiAgbWFyZ2luLXJpZ2h0OiA3MHB4O1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLWV2ZW50LWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLWV2ZW50LWNvbnRhaW5lci5yZXNpemUtYWN0aXZlIHtcbiAgei1pbmRleDogMTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWFsbC1kYXktZXZlbnRzIC5jYWwtZXZlbnQge1xuICBwYWRkaW5nOiAwIDVweDtcbiAgbWFyZ2luLWxlZnQ6IDJweDtcbiAgbWFyZ2luLXJpZ2h0OiAycHg7XG4gIGhlaWdodDogMjhweDtcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWFsbC1kYXktZXZlbnRzIC5jYWwtc3RhcnRzLXdpdGhpbi13ZWVrIC5jYWwtZXZlbnQge1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1cHg7XG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDVweDtcbn1cbltkaXI9cnRsXSAuY2FsLXdlZWstdmlldyAuY2FsLWFsbC1kYXktZXZlbnRzIC5jYWwtc3RhcnRzLXdpdGhpbi13ZWVrIC5jYWwtZXZlbnQge1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiBpbml0aWFsO1xuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiBpbml0aWFsO1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNXB4ICFpbXBvcnRhbnQ7XG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiA1cHggIWltcG9ydGFudDtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtYWxsLWRheS1ldmVudHMgLmNhbC1lbmRzLXdpdGhpbi13ZWVrIC5jYWwtZXZlbnQge1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNXB4O1xuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogNXB4O1xufVxuW2Rpcj1ydGxdIC5jYWwtd2Vlay12aWV3IC5jYWwtYWxsLWRheS1ldmVudHMgLmNhbC1lbmRzLXdpdGhpbi13ZWVrIC5jYWwtZXZlbnQge1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogaW5pdGlhbDtcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IGluaXRpYWw7XG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDVweDtcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNXB4O1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLXRpbWUtbGFiZWwtY29sdW1uIHtcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICBkaXNwbGF5OiBmbGV4O1xuICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xuICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XG4gICAgICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtYWxsLWRheS1ldmVudHMgLmNhbC1yZXNpemUtaGFuZGxlIHtcbiAgd2lkdGg6IDZweDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBjdXJzb3I6IGNvbC1yZXNpemU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLXJlc2l6ZS1oYW5kbGUuY2FsLXJlc2l6ZS1oYW5kbGUtYWZ0ZXItZW5kIHtcbiAgcmlnaHQ6IDA7XG59XG5bZGlyPXJ0bF0gLmNhbC13ZWVrLXZpZXcgLmNhbC1hbGwtZGF5LWV2ZW50cyAuY2FsLXJlc2l6ZS1oYW5kbGUuY2FsLXJlc2l6ZS1oYW5kbGUtYWZ0ZXItZW5kIHtcbiAgcmlnaHQ6IGluaXRpYWw7XG4gIGxlZnQ6IDA7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWV2ZW50LFxuLmNhbC13ZWVrLXZpZXcgLmNhbC1oZWFkZXIge1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICAtby10ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWRyYWctYWN0aXZlIHtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHotaW5kZXg6IDE7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWRyYWctYWN0aXZlICoge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtdGltZS1ldmVudHMge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJvcmRlcjogc29saWQgMXB4O1xuICBib3JkZXItdG9wOiAwO1xuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLXRpbWUtZXZlbnRzIC5jYWwtZGF5LWNvbHVtbnMge1xuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIC13ZWJraXQtYm94LWZsZXg6IDE7XG4gICAgICAtbXMtZmxleC1wb3NpdGl2ZTogMTtcbiAgICAgICAgICBmbGV4LWdyb3c6IDE7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLXRpbWUtZXZlbnRzIC5jYWwtZGF5LWNvbHVtbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtdGltZS1ldmVudHMgLmNhbC1ldmVudHMtY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC10aW1lLWV2ZW50cyAuY2FsLWV2ZW50LWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtdGltZS1ldmVudHMgLmNhbC1ldmVudCB7XG4gIHdpZHRoOiBjYWxjKDEwMCUgLSAycHgpO1xuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJweCk7XG4gIG1hcmdpbjogMXB4O1xuICBwYWRkaW5nOiAwIDVweDtcbiAgbGluZS1oZWlnaHQ6IDI1cHg7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLXRpbWUtZXZlbnRzIC5jYWwtcmVzaXplLWhhbmRsZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDRweDtcbiAgY3Vyc29yOiByb3ctcmVzaXplO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLXRpbWUtZXZlbnRzIC5jYWwtcmVzaXplLWhhbmRsZS5jYWwtcmVzaXplLWhhbmRsZS1hZnRlci1lbmQge1xuICBib3R0b206IDA7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWhvdXItc2VnbWVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtaG91ci1zZWdtZW50OjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiw4LCoFwiO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1ldmVudC1jb250YWluZXI6bm90KC5jYWwtZHJhZ2dhYmxlKSB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZHJhZ2dhYmxlIHtcbiAgY3Vyc29yOiBtb3ZlO1xufVxuLmNhbC13ZWVrLXZpZXcgbXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQsXG4uY2FsLXdlZWstdmlldyAuY2FsLWhvdXItc2VnbWVudCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1ob3VyOm5vdCg6bGFzdC1jaGlsZCkgLmNhbC1ob3VyLXNlZ21lbnQsXG4uY2FsLXdlZWstdmlldyAuY2FsLWhvdXI6bGFzdC1jaGlsZCA6bm90KDpsYXN0LWNoaWxkKSAuY2FsLWhvdXItc2VnbWVudCB7XG4gIGJvcmRlci1ib3R0b206IHRoaW4gZGFzaGVkO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC10aW1lIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHBhZGRpbmctdG9wOiA1cHg7XG4gIHdpZHRoOiA3MHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWhvdXItc2VnbWVudC5jYWwtYWZ0ZXItaG91ci1zdGFydCAuY2FsLXRpbWUge1xuICBkaXNwbGF5OiBub25lO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1zdGFydHMtd2l0aGluLWRheSAuY2FsLWV2ZW50IHtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNXB4O1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNXB4O1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1lbmRzLXdpdGhpbi1kYXkgLmNhbC1ldmVudCB7XG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDVweDtcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDVweDtcbn1cblxuLmNhbC13ZWVrLXZpZXcge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBib3JkZXItdG9wOiBzb2xpZCAxcHggI2UxZTFlMTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWhlYWRlcnMge1xuICBib3JkZXItY29sb3I6ICNlMWUxZTE7XG4gIGJvcmRlci10b3A6IDA7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWRheS1oZWFkZXJzIC5jYWwtaGVhZGVyOm5vdCg6bGFzdC1jaGlsZCkge1xuICBib3JkZXItcmlnaHQtY29sb3I6ICNlMWUxZTE7XG59XG5bZGlyPXJ0bF0gLmNhbC13ZWVrLXZpZXcgLmNhbC1kYXktaGVhZGVycyAuY2FsLWhlYWRlcjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiBpbml0aWFsO1xuICBib3JkZXItbGVmdDogc29saWQgMXB4ICNlMWUxZTEgIWltcG9ydGFudDtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWhlYWRlcnMgLmNhbC1oZWFkZXI6Zmlyc3QtY2hpbGQge1xuICBib3JkZXItbGVmdC1jb2xvcjogI2UxZTFlMTtcbn1cbltkaXI9cnRsXSAuY2FsLXdlZWstdmlldyAuY2FsLWRheS1oZWFkZXJzIC5jYWwtaGVhZGVyOmZpcnN0LWNoaWxkIHtcbiAgYm9yZGVyLWxlZnQtY29sb3I6IGluaXRpYWw7XG4gIGJvcmRlci1yaWdodC1jb2xvcjogI2UxZTFlMTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWhlYWRlcnMgLmNhbC1oZWFkZXI6aG92ZXIsXG4uY2FsLXdlZWstdmlldyAuY2FsLWRheS1oZWFkZXJzIC5jYWwtZHJhZy1vdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZWRlZDtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWNvbHVtbiB7XG4gIGJvcmRlci1sZWZ0LWNvbG9yOiAjZTFlMWUxO1xufVxuW2Rpcj1ydGxdIC5jYWwtd2Vlay12aWV3IC5jYWwtZGF5LWNvbHVtbiB7XG4gIGJvcmRlci1sZWZ0LWNvbG9yOiBpbml0aWFsO1xuICBib3JkZXItcmlnaHQtY29sb3I6ICNlMWUxZTE7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWV2ZW50IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2QxZThmZjtcbiAgYm9yZGVyLWNvbG9yOiAjMWU5MGZmO1xuICBjb2xvcjogIzFlOTBmZjtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtYWxsLWRheS1ldmVudHMge1xuICBib3JkZXItY29sb3I6ICNlMWUxZTE7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWhlYWRlci5jYWwtdG9kYXkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZThmZGU3O1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1oZWFkZXIuY2FsLXdlZWtlbmQgc3BhbiB7XG4gIGNvbG9yOiAjOGIwMDAwO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC10aW1lLWV2ZW50cyB7XG4gIGJvcmRlci1jb2xvcjogI2UxZTFlMTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtdGltZS1ldmVudHMgLmNhbC1kYXktY29sdW1uczpub3QoLmNhbC1yZXNpemUtYWN0aXZlKSAuY2FsLWhvdXItc2VnbWVudDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZGVkZWQ7XG59XG4uY2FsLXdlZWstdmlldyAuY2FsLWhvdXItb2RkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYTtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtZHJhZy1vdmVyIC5jYWwtaG91ci1zZWdtZW50IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZWRlZDtcbn1cbi5jYWwtd2Vlay12aWV3IC5jYWwtaG91cjpub3QoOmxhc3QtY2hpbGQpIC5jYWwtaG91ci1zZWdtZW50LFxuLmNhbC13ZWVrLXZpZXcgLmNhbC1ob3VyOmxhc3QtY2hpbGQgOm5vdCg6bGFzdC1jaGlsZCkgLmNhbC1ob3VyLXNlZ21lbnQge1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAjZTFlMWUxO1xufVxuLmNhbC13ZWVrLXZpZXcgLmNhbC1jdXJyZW50LXRpbWUtbWFya2VyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VhNDMzNDtcbn1cblxuLmNhbC1kYXktdmlldyB7XG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZSBzZWxlY3Rvci10eXBlLW5vLXVua25vd24gKi9cbn1cbi5jYWwtZGF5LXZpZXcgbXdsLWNhbGVuZGFyLXdlZWstdmlldy1oZWFkZXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuLmNhbC1kYXktdmlldyAuY2FsLWV2ZW50cy1jb250YWluZXIge1xuICBtYXJnaW4tbGVmdDogNzBweDtcbn1cbltkaXI9cnRsXSAuY2FsLWRheS12aWV3IC5jYWwtZXZlbnRzLWNvbnRhaW5lciB7XG4gIG1hcmdpbi1sZWZ0OiBpbml0aWFsO1xuICBtYXJnaW4tcmlnaHQ6IDcwcHg7XG59XG4uY2FsLWRheS12aWV3IC5jYWwtZGF5LWNvbHVtbiB7XG4gIGJvcmRlci1sZWZ0OiAwO1xufVxuLmNhbC1kYXktdmlldyAuY2FsLWN1cnJlbnQtdGltZS1tYXJrZXIge1xuICBtYXJnaW4tbGVmdDogNzBweDtcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDcwcHgpO1xufVxuW2Rpcj1ydGxdIC5jYWwtZGF5LXZpZXcgLmNhbC1jdXJyZW50LXRpbWUtbWFya2VyIHtcbiAgbWFyZ2luLWxlZnQ6IGluaXRpYWw7XG4gIG1hcmdpbi1yaWdodDogNzBweDtcbn1cblxuLmNhbC10b29sdGlwIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDcwO1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBsaW5lLWJyZWFrOiBhdXRvO1xuICBsaW5lLWhlaWdodDogMS41O1xuICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0ZXh0LXNoYWRvdzogbm9uZTtcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gIHdvcmQtYnJlYWs6IG5vcm1hbDtcbiAgd29yZC1zcGFjaW5nOiBub3JtYWw7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgd29yZC13cmFwOiBicmVhay13b3JkO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi5jYWwtdG9vbHRpcC5jYWwtdG9vbHRpcC10b3Age1xuICBwYWRkaW5nOiA1cHggMDtcbiAgbWFyZ2luLXRvcDogLTNweDtcbn1cblxuLmNhbC10b29sdGlwLmNhbC10b29sdGlwLXRvcCAuY2FsLXRvb2x0aXAtYXJyb3cge1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDUwJTtcbiAgbWFyZ2luLWxlZnQ6IC01cHg7XG4gIGJvcmRlci13aWR0aDogNXB4IDVweCAwO1xufVxuXG4uY2FsLXRvb2x0aXAuY2FsLXRvb2x0aXAtcmlnaHQge1xuICBwYWRkaW5nOiAwIDVweDtcbiAgbWFyZ2luLWxlZnQ6IDNweDtcbn1cblxuLmNhbC10b29sdGlwLmNhbC10b29sdGlwLXJpZ2h0IC5jYWwtdG9vbHRpcC1hcnJvdyB7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiAwO1xuICBtYXJnaW4tdG9wOiAtNXB4O1xuICBib3JkZXItd2lkdGg6IDVweCA1cHggNXB4IDA7XG59XG5cbi5jYWwtdG9vbHRpcC5jYWwtdG9vbHRpcC1ib3R0b20ge1xuICBwYWRkaW5nOiA1cHggMDtcbiAgbWFyZ2luLXRvcDogM3B4O1xufVxuXG4uY2FsLXRvb2x0aXAuY2FsLXRvb2x0aXAtYm90dG9tIC5jYWwtdG9vbHRpcC1hcnJvdyB7XG4gIHRvcDogMDtcbiAgbGVmdDogNTAlO1xuICBtYXJnaW4tbGVmdDogLTVweDtcbiAgYm9yZGVyLXdpZHRoOiAwIDVweCA1cHg7XG59XG5cbi5jYWwtdG9vbHRpcC5jYWwtdG9vbHRpcC1sZWZ0IHtcbiAgcGFkZGluZzogMCA1cHg7XG4gIG1hcmdpbi1sZWZ0OiAtM3B4O1xufVxuXG4uY2FsLXRvb2x0aXAuY2FsLXRvb2x0aXAtbGVmdCAuY2FsLXRvb2x0aXAtYXJyb3cge1xuICB0b3A6IDUwJTtcbiAgcmlnaHQ6IDA7XG4gIG1hcmdpbi10b3A6IC01cHg7XG4gIGJvcmRlci13aWR0aDogNXB4IDAgNXB4IDVweDtcbn1cblxuLmNhbC10b29sdGlwLWlubmVyIHtcbiAgbWF4LXdpZHRoOiAyMDBweDtcbiAgcGFkZGluZzogM3B4IDhweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xufVxuXG4uY2FsLXRvb2x0aXAtYXJyb3cge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAwO1xuICBoZWlnaHQ6IDA7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1zdHlsZTogc29saWQ7XG59XG5cbi5jYWwtdG9vbHRpcC5jYWwtdG9vbHRpcC10b3AgLmNhbC10b29sdGlwLWFycm93IHtcbiAgYm9yZGVyLXRvcC1jb2xvcjogIzAwMDtcbn1cblxuLmNhbC10b29sdGlwLmNhbC10b29sdGlwLXJpZ2h0IC5jYWwtdG9vbHRpcC1hcnJvdyB7XG4gIGJvcmRlci1yaWdodC1jb2xvcjogIzAwMDtcbn1cblxuLmNhbC10b29sdGlwLmNhbC10b29sdGlwLWJvdHRvbSAuY2FsLXRvb2x0aXAtYXJyb3cge1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAjMDAwO1xufVxuXG4uY2FsLXRvb2x0aXAuY2FsLXRvb2x0aXAtbGVmdCAuY2FsLXRvb2x0aXAtYXJyb3cge1xuICBib3JkZXItbGVmdC1jb2xvcjogIzAwMDtcbn1cblxuLmNhbC10b29sdGlwLWlubmVyIHtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */vex-calendar .calendar-bg {\n  background: url(\"/assets/img/demo/landscape.jpg\") no-repeat center;\n  background-size: cover;\n}\n\n/**\n * angular-calendar overwrites\n */\n.cal-month-view {\n  background: var(--vex-background-card);\n}\n.cal-month-view .cal-days{\n  border-color: var(--vex-foreground-divider);\n}\n.cal-month-view .cal-days .cal-cell-row{\n  border-color: var(--vex-foreground-divider);\n}\n.cal-month-view .cal-header .cal-cell{\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n}\n.cal-month-view .cal-cell-row:hover {\n  background: var(--vex-background-hover);\n}\n.cal-month-view .cal-cell-row .cal-cell:hover {\n  background: var(--vex-background-hover);\n}\n.cal-month-view .cal-cell-row .cal-cell.cal-open {\n  background: var(--vex-background-hover);\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.cal-month-view .cal-day-cell {\n  min-height: 150px;\n}\n.cal-month-view .cal-day-cell.cal-today {\n  background: var(--vex-background-app-bar);\n}\n.cal-month-view .cal-day-cell:not(:last-child){\n  border-color: var(--vex-foreground-divider);\n}\n.cal-month-view .cal-open-day-events{\n  border-bottom-width: 1px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(var(--vex-color-primary-600) / var(--tw-bg-opacity));\n}\n.cal-month-view .cal-open-day-events > div {\n  align-content: center;\n  align-items: center;\n  background: var(--vex-background-card);\n  color: var(--vex-text-dark);\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.cal-month-view .cal-open-day-events > div + div{\n  margin-top: 0.75rem;\n}\n.cal-month-view .cal-open-day-events > div mwl-calendar-event-title {\n  display: flex;\n  flex: 1;\n  flex-direction: row;\n}\n.cal-month-view .cal-open-day-events > div mwl-calendar-event-title .cal-event-title{\n  flex: 1 1 0%;\n  padding: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-text-rgb) / var(--tw-text-opacity));\n}\n.cal-month-view .cal-open-day-events > div .cal-event-action{\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-secondary-text-rgb) / var(--tw-text-opacity));\n}\n.cal-month-view .cal-open-day-events > div .cal-event-action + .cal-event-action{\n  margin-left: 0.75rem;\n}\n\n.cal-week-view,\n.cal-day-view {\n  background: var(--vex-background-card);\n}\n.cal-week-view .cal-header,\n.cal-day-view .cal-header{\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n}\n.cal-week-view .cal-header b,\n.cal-day-view .cal-header b {\n  font-weight: 500;\n}\n.cal-week-view .cal-header.cal-weekend span,\n.cal-day-view .cal-header.cal-weekend span{\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-secondary-text-rgb) / var(--tw-text-opacity));\n}\n.cal-week-view .cal-header.cal-today,\n.cal-day-view .cal-header.cal-today {\n  background: var(--vex-background-app-bar);\n}\n.cal-week-view .cal-day-headers .cal-header:hover,\n.cal-week-view .cal-day-headers .cal-drag-over,\n.cal-day-view .cal-day-headers .cal-header:hover,\n.cal-day-view .cal-day-headers .cal-drag-over {\n  background-color: var(--vex-background-hover);\n}\n.cal-week-view .cal-hour,\n.cal-day-view .cal-hour {\n  background: var(--vex-background-card);\n}\n.cal-week-view .cal-hour:nth-child(odd),\n.cal-day-view .cal-hour:nth-child(odd) {\n  background: var(--vex-background-card);\n}\n.cal-week-view .cal-hour-odd,\n.cal-day-view .cal-hour-odd {\n  background: var(--vex-background-app-bar);\n}\n.cal-week-view .cal-hour-segment:hover,\n.cal-day-view .cal-hour-segment:hover {\n  background: var(--vex-background-hover);\n}\n.cal-week-view .cal-time-events .cal-day-columns .cal-hour-segment:hover,\n.cal-day-view .cal-time-events .cal-day-columns .cal-hour-segment:hover {\n  background: var(--vex-background-hover);\n}\n.cal-week-view .cal-event,\n.cal-day-view .cal-event {\n  align-content: center;\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n}\n.cal-week-view .cal-event mwl-calendar-event-actions,\n.cal-day-view .cal-event mwl-calendar-event-actions {\n  order: 2;\n}\n.cal-week-view .cal-event mwl-calendar-event-title,\n.cal-day-view .cal-event mwl-calendar-event-title {\n  display: block;\n  flex: 1;\n  order: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.cal-week-view .cal-event mwl-calendar-event-title .cal-event-title,\n.cal-day-view .cal-event mwl-calendar-event-title .cal-event-title {\n  outline: none;\n}\n.cal-week-view .cal-event .cal-event-actions,\n.cal-day-view .cal-event .cal-event-actions {\n  align-content: center;\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n}\n.cal-week-view .cal-event .cal-event-actions .cal-event-action,\n.cal-day-view .cal-event .cal-event-actions .cal-event-action{\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-secondary-text-rgb) / var(--tw-text-opacity));\n  height: auto;\n}\n.cal-week-view .cal-event .cal-event-actions .cal-event-action .icon,\n.cal-day-view .cal-event .cal-event-actions .cal-event-action .icon {\n  font-size: 18px;\n  padding: 0.25rem;\n}\n\n.cal-event-title{\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  --tw-text-opacity: 1;\n  color: rgb(var(--vex-foreground-text-rgb) / var(--tw-text-opacity));\n  text-decoration-line: none;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvYXBwcy9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHRTtFQUNFLGtFQUFBO0VBQ0Esc0JBQUE7QUFESjs7QUFLQTs7RUFBQTtBQUdBO0VBQ0Usc0NBQUE7QUFGRjtBQUtJO0VBQUE7QUFBQTtBQUdFO0VBQUE7QUFBQTtBQUtGO0VBQUEsb0JBQUE7RUFBQSx1QkFBQTtFQUFBLG1CQUFBO0VBQUEsb0JBQUE7RUFBQTtBQUFBO0FBSUE7RUFDRSx1Q0FBQTtBQU5OO0FBVU07RUFDRSx1Q0FBQTtBQVJSO0FBV007RUFDRSx1Q0FBQTtFQUNBLCtFQUFBO0VBQUEsbUdBQUE7RUFBQSx1R0FBQTtBQVRSO0FBY0U7RUFDRSxpQkFBQTtBQVpKO0FBY0k7RUFDRSx5Q0FBQTtBQVpOO0FBZ0JNO0VBQUE7QUFBQTtBQUtGO0VBQUEsd0JBQUE7RUFBQSxrQkFBQTtFQUFBO0FBQUE7QUFFQTtFQUNFLHFCQUFBO0VBQ0EsbUJBQUE7RUFDQSxzQ0FBQTtFQUNBLDJCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsMkJBQUE7RUFDQSxvQkFBQTtFQUFBLHFCQUFBO0VBQUEsMEVBQUE7RUFBQSw4RkFBQTtFQUFBLHVHQUFBO0FBZk47QUFrQlE7RUFBQTtBQUFBO0FBR0Y7RUFDRSxhQUFBO0VBQ0EsT0FBQTtFQUNBLG1CQUFBO0FBaEJSO0FBbUJVO0VBQUEsWUFBQTtFQUFBLGdCQUFBO0VBQUEsbUJBQUE7RUFBQSxvQkFBQTtFQUFBLG9CQUFBO0VBQUE7QUFBQTtBQUtGO0VBQUEsb0JBQUE7RUFBQTtBQUFBO0FBR0U7RUFBQTtBQUFBOztBQU9WOztFQUVFLHNDQUFBO0FBdEJGO0FBeUJJOztFQUFBLG1CQUFBO0VBQUEsb0JBQUE7RUFBQTtBQUFBO0FBRUE7O0VBQ0UsZ0JBQUE7QUFwQk47QUF3Qk07O0VBQUEsb0JBQUE7RUFBQTtBQUFBO0FBR0Y7O0VBQ0UseUNBQUE7QUFwQk47QUF3QkU7Ozs7RUFFRSw2Q0FBQTtBQXBCSjtBQXVCRTs7RUFDRSxzQ0FBQTtBQXBCSjtBQXNCSTs7RUFDRSxzQ0FBQTtBQW5CTjtBQXVCRTs7RUFDRSx5Q0FBQTtBQXBCSjtBQXdCSTs7RUFDRSx1Q0FBQTtBQXJCTjtBQTRCUTs7RUFDRSx1Q0FBQTtBQXpCVjtBQStCRTs7RUFDRSxxQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7QUE1Qko7QUE4Qkk7O0VBQ0UsUUFBQTtBQTNCTjtBQThCSTs7RUFDRSxjQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUEzQk47QUE2Qk07O0VBQ0UsYUFBQTtBQTFCUjtBQThCSTs7RUFDRSxxQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7QUEzQk47QUE4QlE7O0VBQUEsb0JBQUE7RUFBQSw2RUFBQTtFQUNBO0FBREE7QUFHQTs7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7QUF6QlY7O0FBaUNFO0VBQUEsbUJBQUE7RUFBQSxvQkFBQTtFQUFBLG9CQUFBO0VBQUEsbUVBQUE7RUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyLWNhbGVuZGFyL2Nzcy9hbmd1bGFyLWNhbGVuZGFyLmNzc1wiO1xuXG52ZXgtY2FsZW5kYXIge1xuICAuY2FsZW5kYXItYmcge1xuICAgIGJhY2tncm91bmQ6IHVybChcIi9hc3NldHMvaW1nL2RlbW8vbGFuZHNjYXBlLmpwZ1wiKSBuby1yZXBlYXQgY2VudGVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIH1cbn1cblxuLyoqXG4gKiBhbmd1bGFyLWNhbGVuZGFyIG92ZXJ3cml0ZXNcbiAqL1xuLmNhbC1tb250aC12aWV3IHtcbiAgYmFja2dyb3VuZDogdmFyKC0tdmV4LWJhY2tncm91bmQtY2FyZCk7XG5cbiAgLmNhbC1kYXlzIHtcbiAgICBAYXBwbHkgYm9yZGVyLWRpdmlkZXI7XG5cbiAgICAuY2FsLWNlbGwtcm93IHtcbiAgICAgIEBhcHBseSBib3JkZXItZGl2aWRlcjtcbiAgICB9XG4gIH1cblxuICAuY2FsLWhlYWRlciAuY2FsLWNlbGwge1xuICAgIEBhcHBseSBweS0zIHRleHQtc20gZm9udC1tZWRpdW07XG4gIH1cblxuICAuY2FsLWNlbGwtcm93IHtcbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKTtcbiAgICB9XG5cbiAgICAuY2FsLWNlbGwge1xuICAgICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKTtcbiAgICAgIH1cblxuICAgICAgJi5jYWwtb3BlbiB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKTtcbiAgICAgICAgQGFwcGx5IHNoYWRvdy1sZztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuY2FsLWRheS1jZWxsIHtcbiAgICBtaW4taGVpZ2h0OiAxNTBweDtcblxuICAgICYuY2FsLXRvZGF5IHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWFwcC1iYXIpO1xuICAgIH1cblxuICAgICY6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICBAYXBwbHkgYm9yZGVyLWRpdmlkZXI7XG4gICAgfVxuICB9XG5cbiAgLmNhbC1vcGVuLWRheS1ldmVudHMge1xuICAgIEBhcHBseSBiZy1wcmltYXJ5LTYwMCBib3JkZXItYjtcblxuICAgID4gZGl2IHtcbiAgICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKTtcbiAgICAgIGNvbG9yOiB2YXIoLS12ZXgtdGV4dC1kYXJrKTtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgQGFwcGx5IHNoYWRvdyBweC02O1xuXG4gICAgICAmICsgZGl2IHtcbiAgICAgICAgQGFwcGx5IG10LTM7XG4gICAgICB9XG5cbiAgICAgIG13bC1jYWxlbmRhci1ldmVudC10aXRsZSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG5cbiAgICAgICAgLmNhbC1ldmVudC10aXRsZSB7XG4gICAgICAgICAgQGFwcGx5IGZsZXgtMSB0ZXh0LWRlZmF1bHQgdGV4dC1zbSBwLTM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLmNhbC1ldmVudC1hY3Rpb24ge1xuICAgICAgICBAYXBwbHkgdGV4dC1zZWNvbmRhcnk7XG5cbiAgICAgICAgJiArIC5jYWwtZXZlbnQtYWN0aW9uIHtcbiAgICAgICAgICBAYXBwbHkgbWwtMztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4uY2FsLXdlZWstdmlldyxcbi5jYWwtZGF5LXZpZXcge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKTtcblxuICAuY2FsLWhlYWRlciB7XG4gICAgQGFwcGx5IHRleHQtc20gZm9udC1tZWRpdW07XG5cbiAgICBiIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgfVxuXG4gICAgJi5jYWwtd2Vla2VuZCBzcGFuIHtcbiAgICAgIEBhcHBseSB0ZXh0LXNlY29uZGFyeTtcbiAgICB9XG5cbiAgICAmLmNhbC10b2RheSB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1hcHAtYmFyKTtcbiAgICB9XG4gIH1cblxuICAuY2FsLWRheS1oZWFkZXJzIC5jYWwtaGVhZGVyOmhvdmVyLFxuICAuY2FsLWRheS1oZWFkZXJzIC5jYWwtZHJhZy1vdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1ob3Zlcik7XG4gIH1cblxuICAuY2FsLWhvdXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWNhcmQpO1xuXG4gICAgJjpudGgtY2hpbGQob2RkKSB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1jYXJkKTtcbiAgICB9XG4gIH1cblxuICAuY2FsLWhvdXItb2RkIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS12ZXgtYmFja2dyb3VuZC1hcHAtYmFyKTtcbiAgfVxuXG4gIC5jYWwtaG91ci1zZWdtZW50IHtcbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWhvdmVyKTtcbiAgICB9XG4gIH1cblxuICAuY2FsLXRpbWUtZXZlbnRzIHtcbiAgICAuY2FsLWRheS1jb2x1bW5zIHtcbiAgICAgIC5jYWwtaG91ci1zZWdtZW50IHtcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tdmV4LWJhY2tncm91bmQtaG92ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLmNhbC1ldmVudCB7XG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAgIG13bC1jYWxlbmRhci1ldmVudC1hY3Rpb25zIHtcbiAgICAgIG9yZGVyOiAyO1xuICAgIH1cblxuICAgIG13bC1jYWxlbmRhci1ldmVudC10aXRsZSB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGZsZXg6IDE7XG4gICAgICBvcmRlcjogMTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cbiAgICAgIC5jYWwtZXZlbnQtdGl0bGUge1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgfVxuICAgIH1cblxuICAgIC5jYWwtZXZlbnQtYWN0aW9ucyB7XG4gICAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuXG4gICAgICAuY2FsLWV2ZW50LWFjdGlvbiB7XG4gICAgICAgIEBhcHBseSB0ZXh0LXNlY29uZGFyeTtcbiAgICAgICAgaGVpZ2h0OiBhdXRvO1xuXG4gICAgICAgIC5pY29uIHtcbiAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgQGFwcGx5IHAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4uY2FsLWV2ZW50LXRpdGxlIHtcbiAgQGFwcGx5IHRleHQtZGVmYXVsdCBuby11bmRlcmxpbmUgdGV4dC1zbTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
    encapsulation: 2
  });
}

/***/ }),

/***/ 40702:
/*!**********************************************************************!*\
  !*** ./node_modules/@mattlewis92/dom-autoscroller/dist/bundle.es.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function getDef(f, d) {
  if (typeof f === 'undefined') {
    return typeof d === 'undefined' ? f : d;
  }
  return f;
}
function boolean(func, def) {
  func = getDef(func, def);
  if (typeof func === 'function') {
    return function f() {
      var arguments$1 = arguments;
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments$1[_key];
      }
      return !!func.apply(this, args);
    };
  }
  return !!func ? function () {
    return true;
  } : function () {
    return false;
  };
}
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

/**
 * Returns `true` if provided input is Element.
 * @name isElement
 * @param {*} [input]
 * @returns {boolean}
 */
var isElement$1 = function (input) {
  return input != null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.nodeType === 1 && _typeof(input.style) === 'object' && _typeof(input.ownerDocument) === 'object';
};
function indexOfElement(elements, element) {
  element = resolveElement(element, true);
  if (!isElement$1(element)) {
    return -1;
  }
  for (var i = 0; i < elements.length; i++) {
    if (elements[i] === element) {
      return i;
    }
  }
  return -1;
}
function hasElement(elements, element) {
  return -1 !== indexOfElement(elements, element);
}
function pushElements(elements, toAdd) {
  for (var i = 0; i < toAdd.length; i++) {
    if (!hasElement(elements, toAdd[i])) {
      elements.push(toAdd[i]);
    }
  }
  return toAdd;
}
function addElements(elements) {
  var arguments$1 = arguments;
  var toAdd = [],
    len = arguments.length - 1;
  while (len-- > 0) {
    toAdd[len] = arguments$1[len + 1];
  }
  toAdd = toAdd.map(resolveElement);
  return pushElements(elements, toAdd);
}
function removeElements(elements) {
  var arguments$1 = arguments;
  var toRemove = [],
    len = arguments.length - 1;
  while (len-- > 0) {
    toRemove[len] = arguments$1[len + 1];
  }
  return toRemove.map(resolveElement).reduce(function (last, e) {
    var index = indexOfElement(elements, e);
    if (index !== -1) {
      return last.concat(elements.splice(index, 1));
    }
    return last;
  }, []);
}
function resolveElement(element, noThrow) {
  if (typeof element === 'string') {
    try {
      return document.querySelector(element);
    } catch (e) {
      throw e;
    }
  }
  if (!isElement$1(element) && !noThrow) {
    throw new TypeError(element + " is not a DOM element.");
  }
  return element;
}
function createPointCB(object, options) {
  // A persistent object (as opposed to returned object) is used to save memory
  // This is good to prevent layout thrashing, or for games, and such

  // NOTE
  // This uses IE fixes which should be OK to remove some day. :)
  // Some speed will be gained by removal of these.

  // pointCB should be saved in a variable on return
  // This allows the usage of element.removeEventListener

  options = options || {};
  var allowUpdate = boolean(options.allowUpdate, true);

  /*if(typeof options.allowUpdate === 'function'){
      allowUpdate = options.allowUpdate;
  }else{
      allowUpdate = function(){return true;};
  }*/

  return function pointCB(event) {
    event = event || window.event; // IE-ism
    object.target = event.target || event.srcElement || event.originalTarget;
    object.element = this;
    object.type = event.type;
    if (!allowUpdate(event)) {
      return;
    }

    // Support touch
    // http://www.creativebloq.com/javascript/make-your-site-work-touch-devices-51411644

    if (event.targetTouches) {
      object.x = event.targetTouches[0].clientX;
      object.y = event.targetTouches[0].clientY;
      object.pageX = event.targetTouches[0].pageX;
      object.pageY = event.targetTouches[0].pageY;
      object.screenX = event.targetTouches[0].screenX;
      object.screenY = event.targetTouches[0].screenY;
    } else {
      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      // NOTE Hopefully this can be removed soon.

      if (event.pageX === null && event.clientX !== null) {
        var eventDoc = event.target && event.target.ownerDocument || document;
        var doc = eventDoc.documentElement;
        var body = eventDoc.body;
        object.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        object.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      } else {
        object.pageX = event.pageX;
        object.pageY = event.pageY;
      }

      // pageX, and pageY change with page scroll
      // so we're not going to use those for x, and y.
      // NOTE Most browsers also alias clientX/Y with x/y
      // so that's something to consider down the road.

      object.x = event.clientX;
      object.y = event.clientY;
      object.screenX = event.screenX;
      object.screenY = event.screenY;
    }
    object.clientX = object.x;
    object.clientY = object.y;
  };

  //NOTE Remember accessibility, Aria roles, and labels.
}

function createWindowRect() {
  var props = {
    top: {
      value: 0,
      enumerable: true
    },
    left: {
      value: 0,
      enumerable: true
    },
    right: {
      value: window.innerWidth,
      enumerable: true
    },
    bottom: {
      value: window.innerHeight,
      enumerable: true
    },
    width: {
      value: window.innerWidth,
      enumerable: true
    },
    height: {
      value: window.innerHeight,
      enumerable: true
    },
    x: {
      value: 0,
      enumerable: true
    },
    y: {
      value: 0,
      enumerable: true
    }
  };
  if (Object.create) {
    return Object.create({}, props);
  } else {
    var rect = {};
    Object.defineProperties(rect, props);
    return rect;
  }
}
function getClientRect(el) {
  if (el === window) {
    return createWindowRect();
  } else {
    try {
      var rect = el.getBoundingClientRect();
      if (rect.x === undefined) {
        rect.x = rect.left;
        rect.y = rect.top;
      }
      return rect;
    } catch (e) {
      throw new TypeError("Can't call getBoundingClientRect on " + el);
    }
  }
}
function pointInside(point, el) {
  var rect = getClientRect(el);
  return point.y > rect.top && point.y < rect.bottom && point.x > rect.left && point.x < rect.right;
}
var objectCreate = void 0;
if (typeof Object.create != 'function') {
  objectCreate = function (undefined$1) {
    var Temp = function Temp() {};
    return function (prototype, propertiesObject) {
      if (prototype !== Object(prototype) && prototype !== null) {
        throw TypeError('Argument must be an object, or null');
      }
      Temp.prototype = prototype || {};
      var result = new Temp();
      Temp.prototype = null;
      if (propertiesObject !== undefined$1) {
        Object.defineProperties(result, propertiesObject);
      }

      // to imitate the case of Object.create(null)
      if (prototype === null) {
        result.__proto__ = null;
      }
      return result;
    };
  }();
} else {
  objectCreate = Object.create;
}
var objectCreate$1 = objectCreate;
var mouseEventProps = ['altKey', 'button', 'buttons', 'clientX', 'clientY', 'ctrlKey', 'metaKey', 'movementX', 'movementY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'region', 'relatedTarget', 'screenX', 'screenY', 'shiftKey', 'which', 'x', 'y'];
function createDispatcher(element) {
  var defaultSettings = {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    button: 0,
    buttons: 1,
    relatedTarget: null,
    region: null
  };
  if (element !== undefined) {
    element.addEventListener('mousemove', onMove);
  }
  function onMove(e) {
    for (var i = 0; i < mouseEventProps.length; i++) {
      defaultSettings[mouseEventProps[i]] = e[mouseEventProps[i]];
    }
  }
  var dispatch = function () {
    if (MouseEvent) {
      return function m1(element, initMove, data) {
        var evt = new MouseEvent('mousemove', createMoveInit(defaultSettings, initMove));

        //evt.dispatched = 'mousemove';
        setSpecial(evt, data);
        return element.dispatchEvent(evt);
      };
    } else if (typeof document.createEvent === 'function') {
      return function m2(element, initMove, data) {
        var settings = createMoveInit(defaultSettings, initMove);
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent("mousemove", true,
        //can bubble
        true,
        //cancelable
        window,
        //view
        0,
        //detail
        settings.screenX,
        //0, //screenX
        settings.screenY,
        //0, //screenY
        settings.clientX,
        //80, //clientX
        settings.clientY,
        //20, //clientY
        settings.ctrlKey,
        //false, //ctrlKey
        settings.altKey,
        //false, //altKey
        settings.shiftKey,
        //false, //shiftKey
        settings.metaKey,
        //false, //metaKey
        settings.button,
        //0, //button
        settings.relatedTarget //null //relatedTarget
        );

        //evt.dispatched = 'mousemove';
        setSpecial(evt, data);
        return element.dispatchEvent(evt);
      };
    } else if (typeof document.createEventObject === 'function') {
      return function m3(element, initMove, data) {
        var evt = document.createEventObject();
        var settings = createMoveInit(defaultSettings, initMove);
        for (var name in settings) {
          evt[name] = settings[name];
        }

        //evt.dispatched = 'mousemove';
        setSpecial(evt, data);
        return element.dispatchEvent(evt);
      };
    }
  }();
  function destroy() {
    if (element) {
      element.removeEventListener('mousemove', onMove, false);
    }
    defaultSettings = null;
  }
  return {
    destroy: destroy,
    dispatch: dispatch
  };
}
function createMoveInit(defaultSettings, initMove) {
  initMove = initMove || {};
  var settings = objectCreate$1(defaultSettings);
  for (var i = 0; i < mouseEventProps.length; i++) {
    if (initMove[mouseEventProps[i]] !== undefined) {
      settings[mouseEventProps[i]] = initMove[mouseEventProps[i]];
    }
  }
  return settings;
}
function setSpecial(e, data) {
  console.log('data ', data);
  e.data = data || {};
  e.dispatched = 'mousemove';
}
var prefix = ['webkit', 'moz', 'ms', 'o'];
var requestFrame = function () {
  if (typeof window === "undefined") {
    return function () {};
  }
  for (var i = 0, limit = prefix.length; i < limit && !window.requestAnimationFrame; ++i) {
    window.requestAnimationFrame = window[prefix[i] + 'RequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = new Date().getTime();
      var ttc = Math.max(0, 16 - now - lastTime);
      var timer = window.setTimeout(function () {
        return callback(now + ttc);
      }, ttc);
      lastTime = now + ttc;
      return timer;
    };
  }
  return window.requestAnimationFrame.bind(window);
}();
var cancelFrame = function () {
  if (typeof window === "undefined") {
    return function () {};
  }
  for (var i = 0, limit = prefix.length; i < limit && !window.cancelAnimationFrame; ++i) {
    window.cancelAnimationFrame = window[prefix[i] + 'CancelAnimationFrame'] || window[prefix[i] + 'CancelRequestAnimationFrame'];
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (timer) {
      window.clearTimeout(timer);
    };
  }
  return window.cancelAnimationFrame.bind(window);
}();
function AutoScroller(elements, options) {
  if (options === void 0) options = {};
  var self = this;
  var maxSpeed = 4,
    scrolling = false;
  if (typeof options.margin !== 'object') {
    var margin = options.margin || -1;
    this.margin = {
      left: margin,
      right: margin,
      top: margin,
      bottom: margin
    };
  } else {
    this.margin = options.margin;
  }

  //this.scrolling = false;
  this.scrollWhenOutside = options.scrollWhenOutside || false;
  var point = {},
    pointCB = createPointCB(point),
    dispatcher = createDispatcher(),
    down = false;
  window.addEventListener('mousemove', pointCB, false);
  window.addEventListener('touchmove', pointCB, false);
  if (!isNaN(options.maxSpeed)) {
    maxSpeed = options.maxSpeed;
  }
  if (typeof maxSpeed !== 'object') {
    maxSpeed = {
      left: maxSpeed,
      right: maxSpeed,
      top: maxSpeed,
      bottom: maxSpeed
    };
  }
  this.autoScroll = boolean(options.autoScroll);
  this.syncMove = boolean(options.syncMove, false);
  this.destroy = function (forceCleanAnimation) {
    window.removeEventListener('mousemove', pointCB, false);
    window.removeEventListener('touchmove', pointCB, false);
    window.removeEventListener('mousedown', onDown, false);
    window.removeEventListener('touchstart', onDown, false);
    window.removeEventListener('mouseup', onUp, false);
    window.removeEventListener('touchend', onUp, false);
    window.removeEventListener('pointerup', onUp, false);
    window.removeEventListener('mouseleave', onMouseOut, false);
    window.removeEventListener('mousemove', onMove, false);
    window.removeEventListener('touchmove', onMove, false);
    window.removeEventListener('scroll', setScroll, true);
    elements = [];
    if (forceCleanAnimation) {
      cleanAnimation();
    }
  };
  this.add = function () {
    var element = [],
      len = arguments.length;
    while (len--) element[len] = arguments[len];
    addElements.apply(void 0, [elements].concat(element));
    return this;
  };
  this.remove = function () {
    var element = [],
      len = arguments.length;
    while (len--) element[len] = arguments[len];
    return removeElements.apply(void 0, [elements].concat(element));
  };
  var hasWindow = null,
    windowAnimationFrame;
  if (Object.prototype.toString.call(elements) !== '[object Array]') {
    elements = [elements];
  }
  (function (temp) {
    elements = [];
    temp.forEach(function (element) {
      if (element === window) {
        hasWindow = window;
      } else {
        self.add(element);
      }
    });
  })(elements);
  Object.defineProperties(this, {
    down: {
      get: function () {
        return down;
      }
    },
    maxSpeed: {
      get: function () {
        return maxSpeed;
      }
    },
    point: {
      get: function () {
        return point;
      }
    },
    scrolling: {
      get: function () {
        return scrolling;
      }
    }
  });
  var current = null,
    animationFrame;
  window.addEventListener('mousedown', onDown, false);
  window.addEventListener('touchstart', onDown, false);
  window.addEventListener('mouseup', onUp, false);
  window.addEventListener('touchend', onUp, false);

  /*
  IE does not trigger mouseup event when scrolling.
  It is a known issue that Microsoft won't fix.
  https://connect.microsoft.com/IE/feedback/details/783058/scrollbar-trigger-mousedown-but-not-mouseup
  IE supports pointer events instead
  */
  window.addEventListener('pointerup', onUp, false);
  window.addEventListener('mousemove', onMove, false);
  window.addEventListener('touchmove', onMove, false);
  window.addEventListener('mouseleave', onMouseOut, false);
  window.addEventListener('scroll', setScroll, true);
  function setScroll(e) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i] === e.target) {
        scrolling = true;
        break;
      }
    }
    if (scrolling) {
      requestFrame(function () {
        return scrolling = false;
      });
    }
  }
  function onDown() {
    down = true;
  }
  function onUp() {
    down = false;
    cleanAnimation();
  }
  function cleanAnimation() {
    cancelFrame(animationFrame);
    cancelFrame(windowAnimationFrame);
  }
  function onMouseOut() {
    down = false;
  }
  function getTarget(target) {
    if (!target) {
      return null;
    }
    if (current === target) {
      return target;
    }
    if (hasElement(elements, target)) {
      return target;
    }
    while (target = target.parentNode) {
      if (hasElement(elements, target)) {
        return target;
      }
    }
    return null;
  }
  function getElementUnderPoint() {
    var underPoint = null;
    for (var i = 0; i < elements.length; i++) {
      if (inside(point, elements[i])) {
        underPoint = elements[i];
      }
    }
    return underPoint;
  }
  function onMove(event) {
    if (!self.autoScroll()) {
      return;
    }
    if (event['dispatched']) {
      return;
    }
    var target = event.target,
      body = document.body;
    if (current && !inside(point, current)) {
      if (!self.scrollWhenOutside) {
        current = null;
      }
    }
    if (target && target.parentNode === body) {
      //The special condition to improve speed.
      target = getElementUnderPoint();
    } else {
      target = getTarget(target);
      if (!target) {
        target = getElementUnderPoint();
      }
    }
    if (target && target !== current) {
      current = target;
    }
    if (hasWindow) {
      cancelFrame(windowAnimationFrame);
      windowAnimationFrame = requestFrame(scrollWindow);
    }
    if (!current) {
      return;
    }
    cancelFrame(animationFrame);
    animationFrame = requestFrame(scrollTick);
  }
  function scrollWindow() {
    autoScroll(hasWindow);
    cancelFrame(windowAnimationFrame);
    windowAnimationFrame = requestFrame(scrollWindow);
  }
  function scrollTick() {
    if (!current) {
      return;
    }
    autoScroll(current);
    cancelFrame(animationFrame);
    animationFrame = requestFrame(scrollTick);
  }
  function autoScroll(el) {
    var rect = getClientRect(el),
      scrollx,
      scrolly;
    if (point.x < rect.left + self.margin.left) {
      scrollx = Math.floor(Math.max(-1, (point.x - rect.left) / self.margin.left - 1) * self.maxSpeed.left);
    } else if (point.x > rect.right - self.margin.right) {
      scrollx = Math.ceil(Math.min(1, (point.x - rect.right) / self.margin.right + 1) * self.maxSpeed.right);
    } else {
      scrollx = 0;
    }
    if (point.y < rect.top + self.margin.top) {
      scrolly = Math.floor(Math.max(-1, (point.y - rect.top) / self.margin.top - 1) * self.maxSpeed.top);
    } else if (point.y > rect.bottom - self.margin.bottom) {
      scrolly = Math.ceil(Math.min(1, (point.y - rect.bottom) / self.margin.bottom + 1) * self.maxSpeed.bottom);
    } else {
      scrolly = 0;
    }
    if (self.syncMove()) {
      /*
      Notes about mousemove event dispatch.
      screen(X/Y) should need to be updated.
      Some other properties might need to be set.
      Keep the syncMove option default false until all inconsistencies are taken care of.
      */
      dispatcher.dispatch(el, {
        pageX: point.pageX + scrollx,
        pageY: point.pageY + scrolly,
        clientX: point.x + scrollx,
        clientY: point.y + scrolly
      });
    }
    setTimeout(function () {
      if (scrolly) {
        scrollY(el, scrolly);
      }
      if (scrollx) {
        scrollX(el, scrollx);
      }
    });
  }
  function scrollY(el, amount) {
    if (el === window) {
      window.scrollTo(el.pageXOffset, el.pageYOffset + amount);
    } else {
      el.scrollTop += amount;
    }
  }
  function scrollX(el, amount) {
    if (el === window) {
      window.scrollTo(el.pageXOffset + amount, el.pageYOffset);
    } else {
      el.scrollLeft += amount;
    }
  }
}
function AutoScrollerFactory(element, options) {
  return new AutoScroller(element, options);
}
function inside(point, el, rect) {
  if (!rect) {
    return pointInside(point, el);
  } else {
    return point.y > rect.top && point.y < rect.bottom && point.x > rect.left && point.x < rect.right;
  }
}

/*
git remote add origin https://github.com/hollowdoor/dom_autoscroller.git
git push -u origin master
*/

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AutoScrollerFactory);

/***/ }),

/***/ 29689:
/*!***************************************************************************!*\
  !*** ./node_modules/angular-calendar/date-adapters/esm/date-fns/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adapterFactory: () => (/* binding */ adapterFactory)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 42321);
/* harmony import */ var calendar_utils_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! calendar-utils/date-adapters/date-fns */ 46669);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns */ 75930);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! date-fns */ 81435);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! date-fns */ 7902);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! date-fns */ 27506);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! date-fns */ 8744);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! date-fns */ 37564);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! date-fns */ 97839);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! date-fns */ 6491);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 86868);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! date-fns */ 23966);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! date-fns */ 63536);



function adapterFactory() {
  return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, (0,calendar_utils_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_0__.adapterFactory)()), {
    addWeeks: date_fns__WEBPACK_IMPORTED_MODULE_2__["default"],
    addMonths: date_fns__WEBPACK_IMPORTED_MODULE_3__["default"],
    subDays: date_fns__WEBPACK_IMPORTED_MODULE_4__["default"],
    subWeeks: date_fns__WEBPACK_IMPORTED_MODULE_5__["default"],
    subMonths: date_fns__WEBPACK_IMPORTED_MODULE_6__["default"],
    getISOWeek: date_fns__WEBPACK_IMPORTED_MODULE_7__["default"],
    setDate: date_fns__WEBPACK_IMPORTED_MODULE_8__["default"],
    setMonth: date_fns__WEBPACK_IMPORTED_MODULE_9__["default"],
    setYear: date_fns__WEBPACK_IMPORTED_MODULE_10__["default"],
    getDate: date_fns__WEBPACK_IMPORTED_MODULE_11__["default"],
    getYear: date_fns__WEBPACK_IMPORTED_MODULE_12__["default"]
  });
}

/***/ }),

/***/ 27914:
/*!*******************************************************!*\
  !*** ./node_modules/calendar-utils/calendar-utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DAYS_OF_WEEK: () => (/* binding */ DAYS_OF_WEEK),
/* harmony export */   EventValidationErrorMessage: () => (/* binding */ EventValidationErrorMessage),
/* harmony export */   SECONDS_IN_DAY: () => (/* binding */ SECONDS_IN_DAY),
/* harmony export */   getAllDayWeekEvents: () => (/* binding */ getAllDayWeekEvents),
/* harmony export */   getDifferenceInDaysWithExclusions: () => (/* binding */ getDifferenceInDaysWithExclusions),
/* harmony export */   getEventsInPeriod: () => (/* binding */ getEventsInPeriod),
/* harmony export */   getMonthView: () => (/* binding */ getMonthView),
/* harmony export */   getWeekView: () => (/* binding */ getWeekView),
/* harmony export */   getWeekViewHeader: () => (/* binding */ getWeekViewHeader),
/* harmony export */   validateEvents: () => (/* binding */ validateEvents)
/* harmony export */ });
var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var DAYS_OF_WEEK;
(function (DAYS_OF_WEEK) {
  DAYS_OF_WEEK[DAYS_OF_WEEK["SUNDAY"] = 0] = "SUNDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["MONDAY"] = 1] = "MONDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["TUESDAY"] = 2] = "TUESDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["WEDNESDAY"] = 3] = "WEDNESDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["THURSDAY"] = 4] = "THURSDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["FRIDAY"] = 5] = "FRIDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["SATURDAY"] = 6] = "SATURDAY";
})(DAYS_OF_WEEK || (DAYS_OF_WEEK = {}));
var DEFAULT_WEEKEND_DAYS = [DAYS_OF_WEEK.SUNDAY, DAYS_OF_WEEK.SATURDAY];
var DAYS_IN_WEEK = 7;
var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_DAY = 60 * 60 * 24;
function getExcludedSeconds(dateAdapter, _a) {
  var startDate = _a.startDate,
    seconds = _a.seconds,
    excluded = _a.excluded,
    precision = _a.precision;
  if (excluded.length < 1) {
    return 0;
  }
  var addSeconds = dateAdapter.addSeconds,
    getDay = dateAdapter.getDay,
    addDays = dateAdapter.addDays;
  var endDate = addSeconds(startDate, seconds - 1);
  var dayStart = getDay(startDate);
  var dayEnd = getDay(endDate);
  var result = 0; // Calculated in seconds
  var current = startDate;
  var _loop_1 = function () {
    var day = getDay(current);
    if (excluded.some(function (excludedDay) {
      return excludedDay === day;
    })) {
      result += calculateExcludedSeconds(dateAdapter, {
        dayStart: dayStart,
        dayEnd: dayEnd,
        day: day,
        precision: precision,
        startDate: startDate,
        endDate: endDate
      });
    }
    current = addDays(current, 1);
  };
  while (current < endDate) {
    _loop_1();
  }
  return result;
}
function calculateExcludedSeconds(dateAdapter, _a) {
  var precision = _a.precision,
    day = _a.day,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    startDate = _a.startDate,
    endDate = _a.endDate;
  var differenceInSeconds = dateAdapter.differenceInSeconds,
    endOfDay = dateAdapter.endOfDay,
    startOfDay = dateAdapter.startOfDay;
  if (precision === 'minutes') {
    if (day === dayStart) {
      return differenceInSeconds(endOfDay(startDate), startDate) + 1;
    } else if (day === dayEnd) {
      return differenceInSeconds(endDate, startOfDay(endDate)) + 1;
    }
  }
  return SECONDS_IN_DAY;
}
function getWeekViewEventSpan(dateAdapter, _a) {
  var event = _a.event,
    offset = _a.offset,
    startOfWeekDate = _a.startOfWeekDate,
    excluded = _a.excluded,
    precision = _a.precision,
    totalDaysInView = _a.totalDaysInView;
  var max = dateAdapter.max,
    differenceInSeconds = dateAdapter.differenceInSeconds,
    addDays = dateAdapter.addDays,
    endOfDay = dateAdapter.endOfDay,
    differenceInDays = dateAdapter.differenceInDays;
  var span = SECONDS_IN_DAY;
  var begin = max([event.start, startOfWeekDate]);
  if (event.end) {
    switch (precision) {
      case 'minutes':
        span = differenceInSeconds(event.end, begin);
        break;
      default:
        span = differenceInDays(addDays(endOfDay(event.end), 1), begin) * SECONDS_IN_DAY;
        break;
    }
  }
  var offsetSeconds = offset * SECONDS_IN_DAY;
  var totalLength = offsetSeconds + span;
  // the best way to detect if an event is outside the week-view
  // is to check if the total span beginning (from startOfWeekDay or event start) exceeds the total days in the view
  var secondsInView = totalDaysInView * SECONDS_IN_DAY;
  if (totalLength > secondsInView) {
    span = secondsInView - offsetSeconds;
  }
  span -= getExcludedSeconds(dateAdapter, {
    startDate: begin,
    seconds: span,
    excluded: excluded,
    precision: precision
  });
  return span / SECONDS_IN_DAY;
}
function getWeekViewEventOffset(dateAdapter, _a) {
  var event = _a.event,
    startOfWeekDate = _a.startOfWeek,
    excluded = _a.excluded,
    precision = _a.precision;
  var differenceInDays = dateAdapter.differenceInDays,
    startOfDay = dateAdapter.startOfDay,
    differenceInSeconds = dateAdapter.differenceInSeconds;
  if (event.start < startOfWeekDate) {
    return 0;
  }
  var offset = 0;
  switch (precision) {
    case 'days':
      offset = differenceInDays(startOfDay(event.start), startOfWeekDate) * SECONDS_IN_DAY;
      break;
    case 'minutes':
      offset = differenceInSeconds(event.start, startOfWeekDate);
      break;
  }
  offset -= getExcludedSeconds(dateAdapter, {
    startDate: startOfWeekDate,
    seconds: offset,
    excluded: excluded,
    precision: precision
  });
  return Math.abs(offset / SECONDS_IN_DAY);
}
function isEventIsPeriod(dateAdapter, _a) {
  var event = _a.event,
    periodStart = _a.periodStart,
    periodEnd = _a.periodEnd;
  var isSameSecond = dateAdapter.isSameSecond;
  var eventStart = event.start;
  var eventEnd = event.end || event.start;
  if (eventStart > periodStart && eventStart < periodEnd) {
    return true;
  }
  if (eventEnd > periodStart && eventEnd < periodEnd) {
    return true;
  }
  if (eventStart < periodStart && eventEnd > periodEnd) {
    return true;
  }
  if (isSameSecond(eventStart, periodStart) || isSameSecond(eventStart, periodEnd)) {
    return true;
  }
  if (isSameSecond(eventEnd, periodStart) || isSameSecond(eventEnd, periodEnd)) {
    return true;
  }
  return false;
}
function getEventsInPeriod(dateAdapter, _a) {
  var events = _a.events,
    periodStart = _a.periodStart,
    periodEnd = _a.periodEnd;
  return events.filter(function (event) {
    return isEventIsPeriod(dateAdapter, {
      event: event,
      periodStart: periodStart,
      periodEnd: periodEnd
    });
  });
}
function getWeekDay(dateAdapter, _a) {
  var date = _a.date,
    _b = _a.weekendDays,
    weekendDays = _b === void 0 ? DEFAULT_WEEKEND_DAYS : _b;
  var startOfDay = dateAdapter.startOfDay,
    isSameDay = dateAdapter.isSameDay,
    getDay = dateAdapter.getDay;
  var today = startOfDay(new Date());
  var day = getDay(date);
  return {
    date: date,
    day: day,
    isPast: date < today,
    isToday: isSameDay(date, today),
    isFuture: date > today,
    isWeekend: weekendDays.indexOf(day) > -1
  };
}
function getWeekViewHeader(dateAdapter, _a) {
  var viewDate = _a.viewDate,
    weekStartsOn = _a.weekStartsOn,
    _b = _a.excluded,
    excluded = _b === void 0 ? [] : _b,
    weekendDays = _a.weekendDays,
    _c = _a.viewStart,
    viewStart = _c === void 0 ? dateAdapter.startOfWeek(viewDate, {
      weekStartsOn: weekStartsOn
    }) : _c,
    _d = _a.viewEnd,
    viewEnd = _d === void 0 ? dateAdapter.addDays(viewStart, DAYS_IN_WEEK) : _d;
  var addDays = dateAdapter.addDays,
    getDay = dateAdapter.getDay;
  var days = [];
  var date = viewStart;
  while (date < viewEnd) {
    if (!excluded.some(function (e) {
      return getDay(date) === e;
    })) {
      days.push(getWeekDay(dateAdapter, {
        date: date,
        weekendDays: weekendDays
      }));
    }
    date = addDays(date, 1);
  }
  return days;
}
function getDifferenceInDaysWithExclusions(dateAdapter, _a) {
  var date1 = _a.date1,
    date2 = _a.date2,
    excluded = _a.excluded;
  var date = date1;
  var diff = 0;
  while (date < date2) {
    if (excluded.indexOf(dateAdapter.getDay(date)) === -1) {
      diff++;
    }
    date = dateAdapter.addDays(date, 1);
  }
  return diff;
}
function getAllDayWeekEvents(dateAdapter, _a) {
  var _b = _a.events,
    events = _b === void 0 ? [] : _b,
    _c = _a.excluded,
    excluded = _c === void 0 ? [] : _c,
    _d = _a.precision,
    precision = _d === void 0 ? 'days' : _d,
    _e = _a.absolutePositionedEvents,
    absolutePositionedEvents = _e === void 0 ? false : _e,
    viewStart = _a.viewStart,
    viewEnd = _a.viewEnd;
  viewStart = dateAdapter.startOfDay(viewStart);
  viewEnd = dateAdapter.endOfDay(viewEnd);
  var differenceInSeconds = dateAdapter.differenceInSeconds,
    differenceInDays = dateAdapter.differenceInDays;
  var maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
    date1: viewStart,
    date2: viewEnd,
    excluded: excluded
  });
  var totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
  var eventsMapped = events.filter(function (event) {
    return event.allDay;
  }).map(function (event) {
    var offset = getWeekViewEventOffset(dateAdapter, {
      event: event,
      startOfWeek: viewStart,
      excluded: excluded,
      precision: precision
    });
    var span = getWeekViewEventSpan(dateAdapter, {
      event: event,
      offset: offset,
      startOfWeekDate: viewStart,
      excluded: excluded,
      precision: precision,
      totalDaysInView: totalDaysInView
    });
    return {
      event: event,
      offset: offset,
      span: span
    };
  }).filter(function (e) {
    return e.offset < maxRange;
  }).filter(function (e) {
    return e.span > 0;
  }).map(function (entry) {
    return {
      event: entry.event,
      offset: entry.offset,
      span: entry.span,
      startsBeforeWeek: entry.event.start < viewStart,
      endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd
    };
  }).sort(function (itemA, itemB) {
    var startSecondsDiff = differenceInSeconds(itemA.event.start, itemB.event.start);
    if (startSecondsDiff === 0) {
      return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
    }
    return startSecondsDiff;
  });
  var allDayEventRows = [];
  var allocatedEvents = [];
  eventsMapped.forEach(function (event, index) {
    if (allocatedEvents.indexOf(event) === -1) {
      allocatedEvents.push(event);
      var rowSpan_1 = event.span + event.offset;
      var otherRowEvents = eventsMapped.slice(index + 1).filter(function (nextEvent) {
        if (nextEvent.offset >= rowSpan_1 && rowSpan_1 + nextEvent.span <= totalDaysInView && allocatedEvents.indexOf(nextEvent) === -1) {
          var nextEventOffset = nextEvent.offset - rowSpan_1;
          if (!absolutePositionedEvents) {
            nextEvent.offset = nextEventOffset;
          }
          rowSpan_1 += nextEvent.span + nextEventOffset;
          allocatedEvents.push(nextEvent);
          return true;
        }
      });
      var weekEvents = __spreadArray([event], otherRowEvents, true);
      var id = weekEvents.filter(function (weekEvent) {
        return weekEvent.event.id;
      }).map(function (weekEvent) {
        return weekEvent.event.id;
      }).join('-');
      allDayEventRows.push(__assign({
        row: weekEvents
      }, id ? {
        id: id
      } : {}));
    }
  });
  return allDayEventRows;
}
function getWeekViewHourGrid(dateAdapter, _a) {
  var events = _a.events,
    viewDate = _a.viewDate,
    hourSegments = _a.hourSegments,
    hourDuration = _a.hourDuration,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    weekStartsOn = _a.weekStartsOn,
    excluded = _a.excluded,
    weekendDays = _a.weekendDays,
    segmentHeight = _a.segmentHeight,
    viewStart = _a.viewStart,
    viewEnd = _a.viewEnd,
    minimumEventHeight = _a.minimumEventHeight;
  var dayViewHourGrid = getDayViewHourGrid(dateAdapter, {
    viewDate: viewDate,
    hourSegments: hourSegments,
    hourDuration: hourDuration,
    dayStart: dayStart,
    dayEnd: dayEnd
  });
  var weekDays = getWeekViewHeader(dateAdapter, {
    viewDate: viewDate,
    weekStartsOn: weekStartsOn,
    excluded: excluded,
    weekendDays: weekendDays,
    viewStart: viewStart,
    viewEnd: viewEnd
  });
  var setHours = dateAdapter.setHours,
    setMinutes = dateAdapter.setMinutes,
    getHours = dateAdapter.getHours,
    getMinutes = dateAdapter.getMinutes;
  return weekDays.map(function (day) {
    var dayView = getDayView(dateAdapter, {
      events: events,
      viewDate: day.date,
      hourSegments: hourSegments,
      dayStart: dayStart,
      dayEnd: dayEnd,
      segmentHeight: segmentHeight,
      eventWidth: 1,
      hourDuration: hourDuration,
      minimumEventHeight: minimumEventHeight
    });
    var hours = dayViewHourGrid.map(function (hour) {
      var segments = hour.segments.map(function (segment) {
        var date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
        return __assign(__assign({}, segment), {
          date: date
        });
      });
      return __assign(__assign({}, hour), {
        segments: segments
      });
    });
    function getColumnCount(allEvents, prevOverlappingEvents) {
      var columnCount = Math.max.apply(Math, prevOverlappingEvents.map(function (iEvent) {
        return iEvent.left + 1;
      }));
      var nextOverlappingEvents = allEvents.filter(function (iEvent) {
        return iEvent.left >= columnCount;
      }).filter(function (iEvent) {
        return getOverLappingWeekViewEvents(prevOverlappingEvents, iEvent.top, iEvent.top + iEvent.height).length > 0;
      });
      if (nextOverlappingEvents.length > 0) {
        return getColumnCount(allEvents, nextOverlappingEvents);
      } else {
        return columnCount;
      }
    }
    var mappedEvents = dayView.events.map(function (event) {
      var columnCount = getColumnCount(dayView.events, getOverLappingWeekViewEvents(dayView.events, event.top, event.top + event.height));
      var width = 100 / columnCount;
      return __assign(__assign({}, event), {
        left: event.left * width,
        width: width
      });
    });
    return {
      hours: hours,
      date: day.date,
      events: mappedEvents.map(function (event) {
        var overLappingEvents = getOverLappingWeekViewEvents(mappedEvents.filter(function (otherEvent) {
          return otherEvent.left > event.left;
        }), event.top, event.top + event.height);
        if (overLappingEvents.length > 0) {
          return __assign(__assign({}, event), {
            width: Math.min.apply(Math, overLappingEvents.map(function (otherEvent) {
              return otherEvent.left;
            })) - event.left
          });
        }
        return event;
      })
    };
  });
}
function getWeekView(dateAdapter, _a) {
  var _b = _a.events,
    events = _b === void 0 ? [] : _b,
    viewDate = _a.viewDate,
    weekStartsOn = _a.weekStartsOn,
    _c = _a.excluded,
    excluded = _c === void 0 ? [] : _c,
    _d = _a.precision,
    precision = _d === void 0 ? 'days' : _d,
    _e = _a.absolutePositionedEvents,
    absolutePositionedEvents = _e === void 0 ? false : _e,
    hourSegments = _a.hourSegments,
    hourDuration = _a.hourDuration,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    weekendDays = _a.weekendDays,
    segmentHeight = _a.segmentHeight,
    minimumEventHeight = _a.minimumEventHeight,
    _f = _a.viewStart,
    viewStart = _f === void 0 ? dateAdapter.startOfWeek(viewDate, {
      weekStartsOn: weekStartsOn
    }) : _f,
    _g = _a.viewEnd,
    viewEnd = _g === void 0 ? dateAdapter.endOfWeek(viewDate, {
      weekStartsOn: weekStartsOn
    }) : _g;
  if (!events) {
    events = [];
  }
  var startOfDay = dateAdapter.startOfDay,
    endOfDay = dateAdapter.endOfDay;
  viewStart = startOfDay(viewStart);
  viewEnd = endOfDay(viewEnd);
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
    events: events,
    periodStart: viewStart,
    periodEnd: viewEnd
  });
  var header = getWeekViewHeader(dateAdapter, {
    viewDate: viewDate,
    weekStartsOn: weekStartsOn,
    excluded: excluded,
    weekendDays: weekendDays,
    viewStart: viewStart,
    viewEnd: viewEnd
  });
  return {
    allDayEventRows: getAllDayWeekEvents(dateAdapter, {
      events: eventsInPeriod,
      excluded: excluded,
      precision: precision,
      absolutePositionedEvents: absolutePositionedEvents,
      viewStart: viewStart,
      viewEnd: viewEnd
    }),
    period: {
      events: eventsInPeriod,
      start: header[0].date,
      end: endOfDay(header[header.length - 1].date)
    },
    hourColumns: getWeekViewHourGrid(dateAdapter, {
      events: events,
      viewDate: viewDate,
      hourSegments: hourSegments,
      hourDuration: hourDuration,
      dayStart: dayStart,
      dayEnd: dayEnd,
      weekStartsOn: weekStartsOn,
      excluded: excluded,
      weekendDays: weekendDays,
      segmentHeight: segmentHeight,
      viewStart: viewStart,
      viewEnd: viewEnd,
      minimumEventHeight: minimumEventHeight
    })
  };
}
function getMonthView(dateAdapter, _a) {
  var _b = _a.events,
    events = _b === void 0 ? [] : _b,
    viewDate = _a.viewDate,
    weekStartsOn = _a.weekStartsOn,
    _c = _a.excluded,
    excluded = _c === void 0 ? [] : _c,
    _d = _a.viewStart,
    viewStart = _d === void 0 ? dateAdapter.startOfMonth(viewDate) : _d,
    _e = _a.viewEnd,
    viewEnd = _e === void 0 ? dateAdapter.endOfMonth(viewDate) : _e,
    weekendDays = _a.weekendDays;
  if (!events) {
    events = [];
  }
  var startOfWeek = dateAdapter.startOfWeek,
    endOfWeek = dateAdapter.endOfWeek,
    differenceInDays = dateAdapter.differenceInDays,
    startOfDay = dateAdapter.startOfDay,
    addHours = dateAdapter.addHours,
    endOfDay = dateAdapter.endOfDay,
    isSameMonth = dateAdapter.isSameMonth,
    getDay = dateAdapter.getDay;
  var start = startOfWeek(viewStart, {
    weekStartsOn: weekStartsOn
  });
  var end = endOfWeek(viewEnd, {
    weekStartsOn: weekStartsOn
  });
  var eventsInMonth = getEventsInPeriod(dateAdapter, {
    events: events,
    periodStart: start,
    periodEnd: end
  });
  var initialViewDays = [];
  var previousDate;
  var _loop_2 = function (i) {
    // hacky fix for https://github.com/mattlewis92/angular-calendar/issues/173
    var date;
    if (previousDate) {
      date = startOfDay(addHours(previousDate, HOURS_IN_DAY));
      if (previousDate.getTime() === date.getTime()) {
        // DST change, so need to add 25 hours
        /* istanbul ignore next */
        date = startOfDay(addHours(previousDate, HOURS_IN_DAY + 1));
      }
      previousDate = date;
    } else {
      date = previousDate = start;
    }
    if (!excluded.some(function (e) {
      return getDay(date) === e;
    })) {
      var day = getWeekDay(dateAdapter, {
        date: date,
        weekendDays: weekendDays
      });
      var eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events: eventsInMonth,
        periodStart: startOfDay(date),
        periodEnd: endOfDay(date)
      });
      day.inMonth = isSameMonth(date, viewDate);
      day.events = eventsInPeriod;
      day.badgeTotal = eventsInPeriod.length;
      initialViewDays.push(day);
    }
  };
  for (var i = 0; i < differenceInDays(end, start) + 1; i++) {
    _loop_2(i);
  }
  var days = [];
  var totalDaysVisibleInWeek = DAYS_IN_WEEK - excluded.length;
  if (totalDaysVisibleInWeek < DAYS_IN_WEEK) {
    for (var i = 0; i < initialViewDays.length; i += totalDaysVisibleInWeek) {
      var row = initialViewDays.slice(i, i + totalDaysVisibleInWeek);
      var isRowInMonth = row.some(function (day) {
        return viewStart <= day.date && day.date < viewEnd;
      });
      if (isRowInMonth) {
        days = __spreadArray(__spreadArray([], days, true), row, true);
      }
    }
  } else {
    days = initialViewDays;
  }
  var rows = Math.floor(days.length / totalDaysVisibleInWeek);
  var rowOffsets = [];
  for (var i = 0; i < rows; i++) {
    rowOffsets.push(i * totalDaysVisibleInWeek);
  }
  return {
    rowOffsets: rowOffsets,
    totalDaysVisibleInWeek: totalDaysVisibleInWeek,
    days: days,
    period: {
      start: days[0].date,
      end: endOfDay(days[days.length - 1].date),
      events: eventsInMonth
    }
  };
}
function getOverLappingWeekViewEvents(events, top, bottom) {
  return events.filter(function (previousEvent) {
    var previousEventTop = previousEvent.top;
    var previousEventBottom = previousEvent.top + previousEvent.height;
    if (top < previousEventBottom && previousEventBottom < bottom) {
      return true;
    } else if (top < previousEventTop && previousEventTop < bottom) {
      return true;
    } else if (previousEventTop <= top && bottom <= previousEventBottom) {
      return true;
    }
    return false;
  });
}
function getDayView(dateAdapter, _a) {
  var events = _a.events,
    viewDate = _a.viewDate,
    hourSegments = _a.hourSegments,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    eventWidth = _a.eventWidth,
    segmentHeight = _a.segmentHeight,
    hourDuration = _a.hourDuration,
    minimumEventHeight = _a.minimumEventHeight;
  var setMinutes = dateAdapter.setMinutes,
    setHours = dateAdapter.setHours,
    startOfDay = dateAdapter.startOfDay,
    startOfMinute = dateAdapter.startOfMinute,
    endOfDay = dateAdapter.endOfDay,
    differenceInMinutes = dateAdapter.differenceInMinutes;
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  endOfView.setSeconds(59, 999);
  var previousDayEvents = [];
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
    events: events.filter(function (event) {
      return !event.allDay;
    }),
    periodStart: startOfView,
    periodEnd: endOfView
  });
  var dayViewEvents = eventsInPeriod.sort(function (eventA, eventB) {
    return eventA.start.valueOf() - eventB.start.valueOf();
  }).map(function (event) {
    var eventStart = event.start;
    var eventEnd = event.end || eventStart;
    var startsBeforeDay = eventStart < startOfView;
    var endsAfterDay = eventEnd > endOfView;
    var hourHeightModifier = hourSegments * segmentHeight / (hourDuration || MINUTES_IN_HOUR);
    var top = 0;
    if (eventStart > startOfView) {
      // adjust the difference in minutes if the user's offset is different between the start of the day and the event (e.g. when going to or from DST)
      var eventOffset = dateAdapter.getTimezoneOffset(eventStart);
      var startOffset = dateAdapter.getTimezoneOffset(startOfView);
      var diff = startOffset - eventOffset;
      top += differenceInMinutes(eventStart, startOfView) + diff;
    }
    top *= hourHeightModifier;
    top = Math.floor(top);
    var startDate = startsBeforeDay ? startOfView : eventStart;
    var endDate = endsAfterDay ? endOfView : eventEnd;
    var timezoneOffset = dateAdapter.getTimezoneOffset(startDate) - dateAdapter.getTimezoneOffset(endDate);
    var height = differenceInMinutes(endDate, startDate) + timezoneOffset;
    if (!event.end) {
      height = segmentHeight;
    } else {
      height *= hourHeightModifier;
    }
    if (minimumEventHeight && height < minimumEventHeight) {
      height = minimumEventHeight;
    }
    height = Math.floor(height);
    var bottom = top + height;
    var overlappingPreviousEvents = getOverLappingWeekViewEvents(previousDayEvents, top, bottom);
    var left = 0;
    while (overlappingPreviousEvents.some(function (previousEvent) {
      return previousEvent.left === left;
    })) {
      left += eventWidth;
    }
    var dayEvent = {
      event: event,
      height: height,
      width: eventWidth,
      top: top,
      left: left,
      startsBeforeDay: startsBeforeDay,
      endsAfterDay: endsAfterDay
    };
    previousDayEvents.push(dayEvent);
    return dayEvent;
  });
  var width = Math.max.apply(Math, dayViewEvents.map(function (event) {
    return event.left + event.width;
  }));
  var allDayEvents = getEventsInPeriod(dateAdapter, {
    events: events.filter(function (event) {
      return event.allDay;
    }),
    periodStart: startOfDay(startOfView),
    periodEnd: endOfDay(endOfView)
  });
  return {
    events: dayViewEvents,
    width: width,
    allDayEvents: allDayEvents,
    period: {
      events: eventsInPeriod,
      start: startOfView,
      end: endOfView
    }
  };
}
function sanitiseHours(hours) {
  return Math.max(Math.min(23, hours), 0);
}
function sanitiseMinutes(minutes) {
  return Math.max(Math.min(59, minutes), 0);
}
function getDayViewHourGrid(dateAdapter, _a) {
  var viewDate = _a.viewDate,
    hourSegments = _a.hourSegments,
    hourDuration = _a.hourDuration,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd;
  var setMinutes = dateAdapter.setMinutes,
    setHours = dateAdapter.setHours,
    startOfDay = dateAdapter.startOfDay,
    startOfMinute = dateAdapter.startOfMinute,
    endOfDay = dateAdapter.endOfDay,
    addMinutes = dateAdapter.addMinutes,
    addDays = dateAdapter.addDays;
  var hours = [];
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  var segmentDuration = (hourDuration || MINUTES_IN_HOUR) / hourSegments;
  var startOfViewDay = startOfDay(viewDate);
  var endOfViewDay = endOfDay(viewDate);
  var dateAdjustment = function (d) {
    return d;
  };
  // this means that we change from or to DST on this day and that's going to cause problems so we bump the date
  if (dateAdapter.getTimezoneOffset(startOfViewDay) !== dateAdapter.getTimezoneOffset(endOfViewDay)) {
    startOfViewDay = addDays(startOfViewDay, 1);
    startOfView = addDays(startOfView, 1);
    endOfView = addDays(endOfView, 1);
    dateAdjustment = function (d) {
      return addDays(d, -1);
    };
  }
  var dayDuration = hourDuration ? HOURS_IN_DAY * 60 / hourDuration : MINUTES_IN_HOUR;
  for (var i = 0; i < dayDuration; i++) {
    var segments = [];
    for (var j = 0; j < hourSegments; j++) {
      var date = addMinutes(addMinutes(startOfView, i * (hourDuration || MINUTES_IN_HOUR)), j * segmentDuration);
      if (date >= startOfView && date < endOfView) {
        segments.push({
          date: dateAdjustment(date),
          displayDate: date,
          isStart: j === 0
        });
      }
    }
    if (segments.length > 0) {
      hours.push({
        segments: segments
      });
    }
  }
  return hours;
}
var EventValidationErrorMessage;
(function (EventValidationErrorMessage) {
  EventValidationErrorMessage["NotArray"] = "Events must be an array";
  EventValidationErrorMessage["StartPropertyMissing"] = "Event is missing the `start` property";
  EventValidationErrorMessage["StartPropertyNotDate"] = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.";
  EventValidationErrorMessage["EndPropertyNotDate"] = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.";
  EventValidationErrorMessage["EndsBeforeStart"] = "Event `start` property occurs after the `end`";
})(EventValidationErrorMessage || (EventValidationErrorMessage = {}));
function validateEvents(events, log) {
  var isValid = true;
  function isError(msg, event) {
    log(msg, event);
    isValid = false;
  }
  if (!Array.isArray(events)) {
    log(EventValidationErrorMessage.NotArray, events);
    return false;
  }
  events.forEach(function (event) {
    if (!event.start) {
      isError(EventValidationErrorMessage.StartPropertyMissing, event);
    } else if (!(event.start instanceof Date)) {
      isError(EventValidationErrorMessage.StartPropertyNotDate, event);
    }
    if (event.end) {
      if (!(event.end instanceof Date)) {
        isError(EventValidationErrorMessage.EndPropertyNotDate, event);
      }
      if (event.start > event.end) {
        isError(EventValidationErrorMessage.EndsBeforeStart, event);
      }
    }
  });
  return isValid;
}

/***/ }),

/***/ 46669:
/*!*************************************************************************!*\
  !*** ./node_modules/calendar-utils/date-adapters/esm/date-fns/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adapterFactory: () => (/* binding */ adapterFactory)
/* harmony export */ });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-fns */ 65822);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! date-fns */ 15870);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns */ 58415);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! date-fns */ 3654);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! date-fns */ 84411);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! date-fns */ 8276);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! date-fns */ 7480);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! date-fns */ 4512);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! date-fns */ 72775);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! date-fns */ 12478);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 12040);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! date-fns */ 51032);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! date-fns */ 77393);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! date-fns */ 52665);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! date-fns */ 11568);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! date-fns */ 68472);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! date-fns */ 14562);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! date-fns */ 38020);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! date-fns */ 57016);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! date-fns */ 55702);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! date-fns */ 2848);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! date-fns */ 97929);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! date-fns */ 22487);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! date-fns */ 42827);

function getTimezoneOffset(date) {
  return new Date(date).getTimezoneOffset();
}
function adapterFactory() {
  return {
    addDays: date_fns__WEBPACK_IMPORTED_MODULE_0__["default"],
    addHours: date_fns__WEBPACK_IMPORTED_MODULE_1__["default"],
    addMinutes: date_fns__WEBPACK_IMPORTED_MODULE_2__["default"],
    addSeconds: date_fns__WEBPACK_IMPORTED_MODULE_3__["default"],
    differenceInDays: date_fns__WEBPACK_IMPORTED_MODULE_4__["default"],
    differenceInMinutes: date_fns__WEBPACK_IMPORTED_MODULE_5__["default"],
    differenceInSeconds: date_fns__WEBPACK_IMPORTED_MODULE_6__["default"],
    endOfDay: date_fns__WEBPACK_IMPORTED_MODULE_7__["default"],
    endOfMonth: date_fns__WEBPACK_IMPORTED_MODULE_8__["default"],
    endOfWeek: date_fns__WEBPACK_IMPORTED_MODULE_9__["default"],
    getDay: date_fns__WEBPACK_IMPORTED_MODULE_10__["default"],
    getMonth: date_fns__WEBPACK_IMPORTED_MODULE_11__["default"],
    isSameDay: date_fns__WEBPACK_IMPORTED_MODULE_12__["default"],
    isSameMonth: date_fns__WEBPACK_IMPORTED_MODULE_13__["default"],
    isSameSecond: date_fns__WEBPACK_IMPORTED_MODULE_14__["default"],
    max: date_fns__WEBPACK_IMPORTED_MODULE_15__["default"],
    setHours: date_fns__WEBPACK_IMPORTED_MODULE_16__["default"],
    setMinutes: date_fns__WEBPACK_IMPORTED_MODULE_17__["default"],
    startOfDay: date_fns__WEBPACK_IMPORTED_MODULE_18__["default"],
    startOfMinute: date_fns__WEBPACK_IMPORTED_MODULE_19__["default"],
    startOfMonth: date_fns__WEBPACK_IMPORTED_MODULE_20__["default"],
    startOfWeek: date_fns__WEBPACK_IMPORTED_MODULE_21__["default"],
    getHours: date_fns__WEBPACK_IMPORTED_MODULE_22__["default"],
    getMinutes: date_fns__WEBPACK_IMPORTED_MODULE_23__["default"],
    getTimezoneOffset: getTimezoneOffset
  };
}

/***/ }),

/***/ 80373:
/*!****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/defaultOptions/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultOptions: () => (/* binding */ getDefaultOptions),
/* harmony export */   setDefaultOptions: () => (/* binding */ setDefaultOptions)
/* harmony export */ });
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function setDefaultOptions(newOptions) {
  defaultOptions = newOptions;
}

/***/ }),

/***/ 76010:
/*!*********************************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getTimezoneOffsetInMilliseconds)
/* harmony export */ });
/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

/***/ }),

/***/ 67265:
/*!**************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/requiredArgs/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ requiredArgs)
/* harmony export */ });
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

/***/ }),

/***/ 35574:
/*!*****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/roundingMethods/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRoundingMethod: () => (/* binding */ getRoundingMethod)
/* harmony export */ });
var roundingMap = {
  ceil: Math.ceil,
  round: Math.round,
  floor: Math.floor,
  trunc: function trunc(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  } // Math.trunc is not supported by IE
};

var defaultRoundingMethod = 'trunc';
function getRoundingMethod(method) {
  return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
}

/***/ }),

/***/ 21578:
/*!***********************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/toInteger/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toInteger)
/* harmony export */ });
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

/***/ }),

/***/ 65822:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/addDays/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addDays)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} - the new date with the days added
 * @throws {TypeError} - 2 arguments required
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
function addDays(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyAmount);
  if (isNaN(amount)) {
    return new Date(NaN);
  }
  if (!amount) {
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}

/***/ }),

/***/ 15870:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/addHours/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addHours)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addMilliseconds/index.js */ 16092);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



var MILLISECONDS_IN_HOUR = 3600000;

/**
 * @name addHours
 * @category Hour Helpers
 * @summary Add the specified number of hours to the given date.
 *
 * @description
 * Add the specified number of hours to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of hours to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the hours added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 2 hours to 10 July 2014 23:00:00:
 * const result = addHours(new Date(2014, 6, 10, 23, 0), 2)
 * //=> Fri Jul 11 2014 01:00:00
 */
function addHours(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, amount * MILLISECONDS_IN_HOUR);
}

/***/ }),

/***/ 16092:
/*!************************************************************!*\
  !*** ./node_modules/date-fns/esm/addMilliseconds/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addMilliseconds)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var timestamp = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate).getTime();
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyAmount);
  return new Date(timestamp + amount);
}

/***/ }),

/***/ 58415:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/addMinutes/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addMinutes)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addMilliseconds/index.js */ 16092);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



var MILLISECONDS_IN_MINUTE = 60000;

/**
 * @name addMinutes
 * @category Minute Helpers
 * @summary Add the specified number of minutes to the given date.
 *
 * @description
 * Add the specified number of minutes to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of minutes to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the minutes added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 30 minutes to 10 July 2014 12:00:00:
 * const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 12:30:00
 */
function addMinutes(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
}

/***/ }),

/***/ 81435:
/*!******************************************************!*\
  !*** ./node_modules/date-fns/esm/addMonths/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addMonths)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * const result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 */
function addMonths(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyAmount);
  if (isNaN(amount)) {
    return new Date(NaN);
  }
  if (!amount) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return date;
  }
  var dayOfMonth = date.getDate();

  // The JS Date object supports date math by accepting out-of-bounds values for
  // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
  // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
  // want except that dates will wrap around the end of a month, meaning that
  // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
  // we'll default to the end of the desired month by adding 1 to the desired
  // month and using a date of 0 to back up one day to the end of the desired
  // month.
  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    // If we're already at the end of the month, then this is the correct date
    // and we're done.
    return endOfDesiredMonth;
  } else {
    // Otherwise, we now know that setting the original day-of-month value won't
    // cause an overflow, so set the desired day-of-month. Note that we can't
    // just set the date of `endOfDesiredMonth` because that object may have had
    // its time changed in the unusual case where where a DST transition was on
    // the last day of the month and its local time was in the hour skipped or
    // repeated next to a DST transition.  So we use `date` instead which is
    // guaranteed to still have the original time.
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}

/***/ }),

/***/ 3654:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/addSeconds/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addSeconds)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addMilliseconds/index.js */ 16092);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name addSeconds
 * @category Second Helpers
 * @summary Add the specified number of seconds to the given date.
 *
 * @description
 * Add the specified number of seconds to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of seconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the seconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 30 seconds to 10 July 2014 12:45:00:
 * const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:45:30
 */
function addSeconds(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, amount * 1000);
}

/***/ }),

/***/ 75930:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/addWeeks/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addWeeks)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _addDays_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addDays/index.js */ 65822);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name addWeeks
 * @category Week Helpers
 * @summary Add the specified number of weeks to the given date.
 *
 * @description
 * Add the specified number of week to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of weeks to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the weeks added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 4 weeks to 1 September 2014:
 * const result = addWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Sep 29 2014 00:00:00
 */
function addWeeks(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  var days = amount * 7;
  return (0,_addDays_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, days);
}

/***/ }),

/***/ 11389:
/*!******************************************************!*\
  !*** ./node_modules/date-fns/esm/constants/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   daysInWeek: () => (/* binding */ daysInWeek),
/* harmony export */   daysInYear: () => (/* binding */ daysInYear),
/* harmony export */   maxTime: () => (/* binding */ maxTime),
/* harmony export */   millisecondsInHour: () => (/* binding */ millisecondsInHour),
/* harmony export */   millisecondsInMinute: () => (/* binding */ millisecondsInMinute),
/* harmony export */   millisecondsInSecond: () => (/* binding */ millisecondsInSecond),
/* harmony export */   minTime: () => (/* binding */ minTime),
/* harmony export */   minutesInHour: () => (/* binding */ minutesInHour),
/* harmony export */   monthsInQuarter: () => (/* binding */ monthsInQuarter),
/* harmony export */   monthsInYear: () => (/* binding */ monthsInYear),
/* harmony export */   quartersInYear: () => (/* binding */ quartersInYear),
/* harmony export */   secondsInDay: () => (/* binding */ secondsInDay),
/* harmony export */   secondsInHour: () => (/* binding */ secondsInHour),
/* harmony export */   secondsInMinute: () => (/* binding */ secondsInMinute),
/* harmony export */   secondsInMonth: () => (/* binding */ secondsInMonth),
/* harmony export */   secondsInQuarter: () => (/* binding */ secondsInQuarter),
/* harmony export */   secondsInWeek: () => (/* binding */ secondsInWeek),
/* harmony export */   secondsInYear: () => (/* binding */ secondsInYear)
/* harmony export */ });
/**
 * Days in 1 week.
 *
 * @name daysInWeek
 * @constant
 * @type {number}
 * @default
 */
var daysInWeek = 7;

/**
 * Days in 1 year
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occures every 4 years, except for years that are divisable by 100 and not divisable by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 *
 * @name daysInYear
 * @constant
 * @type {number}
 * @default
 */
var daysInYear = 365.2425;

/**
 * Maximum allowed time.
 *
 * @name maxTime
 * @constant
 * @type {number}
 * @default
 */
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;

/**
 * Milliseconds in 1 minute
 *
 * @name millisecondsInMinute
 * @constant
 * @type {number}
 * @default
 */
var millisecondsInMinute = 60000;

/**
 * Milliseconds in 1 hour
 *
 * @name millisecondsInHour
 * @constant
 * @type {number}
 * @default
 */
var millisecondsInHour = 3600000;

/**
 * Milliseconds in 1 second
 *
 * @name millisecondsInSecond
 * @constant
 * @type {number}
 * @default
 */
var millisecondsInSecond = 1000;

/**
 * Minimum allowed time.
 *
 * @name minTime
 * @constant
 * @type {number}
 * @default
 */
var minTime = -maxTime;

/**
 * Minutes in 1 hour
 *
 * @name minutesInHour
 * @constant
 * @type {number}
 * @default
 */
var minutesInHour = 60;

/**
 * Months in 1 quarter
 *
 * @name monthsInQuarter
 * @constant
 * @type {number}
 * @default
 */
var monthsInQuarter = 3;

/**
 * Months in 1 year
 *
 * @name monthsInYear
 * @constant
 * @type {number}
 * @default
 */
var monthsInYear = 12;

/**
 * Quarters in 1 year
 *
 * @name quartersInYear
 * @constant
 * @type {number}
 * @default
 */
var quartersInYear = 4;

/**
 * Seconds in 1 hour
 *
 * @name secondsInHour
 * @constant
 * @type {number}
 * @default
 */
var secondsInHour = 3600;

/**
 * Seconds in 1 minute
 *
 * @name secondsInMinute
 * @constant
 * @type {number}
 * @default
 */
var secondsInMinute = 60;

/**
 * Seconds in 1 day
 *
 * @name secondsInDay
 * @constant
 * @type {number}
 * @default
 */
var secondsInDay = secondsInHour * 24;

/**
 * Seconds in 1 week
 *
 * @name secondsInWeek
 * @constant
 * @type {number}
 * @default
 */
var secondsInWeek = secondsInDay * 7;

/**
 * Seconds in 1 year
 *
 * @name secondsInYear
 * @constant
 * @type {number}
 * @default
 */
var secondsInYear = secondsInDay * daysInYear;

/**
 * Seconds in 1 month
 *
 * @name secondsInMonth
 * @constant
 * @type {number}
 * @default
 */
var secondsInMonth = secondsInYear / 12;

/**
 * Seconds in 1 quarter
 *
 * @name secondsInQuarter
 * @constant
 * @type {number}
 * @default
 */
var secondsInQuarter = secondsInMonth * 3;

/***/ }),

/***/ 7746:
/*!*********************************************************************!*\
  !*** ./node_modules/date-fns/esm/differenceInCalendarDays/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ differenceInCalendarDays)
/* harmony export */ });
/* harmony import */ var _lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/getTimezoneOffsetInMilliseconds/index.js */ 76010);
/* harmony import */ var _startOfDay_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../startOfDay/index.js */ 57016);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



var MILLISECONDS_IN_DAY = 86400000;

/**
 * @name differenceInCalendarDays
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates. This means that the times are removed
 * from the dates and then the difference in days is calculated.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar days
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 * // How many calendar days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInCalendarDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 1
 */
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var startOfDayLeft = (0,_startOfDay_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateLeft);
  var startOfDayRight = (0,_startOfDay_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateRight);
  var timestampLeft = startOfDayLeft.getTime() - (0,_lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(startOfDayLeft);
  var timestampRight = startOfDayRight.getTime() - (0,_lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(startOfDayRight);

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a day is not constant
  // (e.g. it's different in the day of the daylight saving time clock shift)
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

/***/ }),

/***/ 84411:
/*!*************************************************************!*\
  !*** ./node_modules/date-fns/esm/differenceInDays/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ differenceInDays)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _differenceInCalendarDays_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../differenceInCalendarDays/index.js */ 7746);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


 // Like `compareAsc` but uses local time not UTC, which is needed
// for accurate equality comparisons of UTC timestamps that end up
// having the same representation in local time, e.g. one hour before
// DST ends vs. the instant that DST ends.
function compareLocalAsc(dateLeft, dateRight) {
  var diff = dateLeft.getFullYear() - dateRight.getFullYear() || dateLeft.getMonth() - dateRight.getMonth() || dateLeft.getDate() - dateRight.getDate() || dateLeft.getHours() - dateRight.getHours() || dateLeft.getMinutes() - dateRight.getMinutes() || dateLeft.getSeconds() - dateRight.getSeconds() || dateLeft.getMilliseconds() - dateRight.getMilliseconds();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}

/**
 * @name differenceInDays
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full day periods between two dates. Fractional days are
 * truncated towards zero.
 *
 * One "full day" is the distance between a local time in one day to the same
 * local time on the next or previous day. A full day can sometimes be less than
 * or more than 24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 24-hour periods, use this instead:
 * `Math.floor(differenceInHours(dateLeft, dateRight)/24)|0`.
 *
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of full days according to the local timezone
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 * // How many full days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 0
 * // How many full days are between
 * // 1 March 2020 0:00 and 1 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 92 days, even in
 * // time zones where DST starts and the
 * // period has only 92*24-1 hours.
 * const result = differenceInDays(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 1)
 * )
//=> 92
 */
function differenceInDays(dirtyDateLeft, dirtyDateRight) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var dateLeft = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateLeft);
  var dateRight = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateRight);
  var sign = compareLocalAsc(dateLeft, dateRight);
  var difference = Math.abs((0,_differenceInCalendarDays_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dateLeft, dateRight));
  dateLeft.setDate(dateLeft.getDate() - sign * difference);

  // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
  // If so, result must be decreased by 1 in absolute value
  var isLastDayNotFull = Number(compareLocalAsc(dateLeft, dateRight) === -sign);
  var result = sign * (difference - isLastDayNotFull);
  // Prevent negative zero
  return result === 0 ? 0 : result;
}

/***/ }),

/***/ 51482:
/*!*********************************************************************!*\
  !*** ./node_modules/date-fns/esm/differenceInMilliseconds/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ differenceInMilliseconds)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of milliseconds
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(dateLeft, dateRight) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  return (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dateLeft).getTime() - (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dateRight).getTime();
}

/***/ }),

/***/ 8276:
/*!****************************************************************!*\
  !*** ./node_modules/date-fns/esm/differenceInMinutes/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ differenceInMinutes)
/* harmony export */ });
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/index.js */ 11389);
/* harmony import */ var _differenceInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../differenceInMilliseconds/index.js */ 51482);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);
/* harmony import */ var _lib_roundingMethods_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_lib/roundingMethods/index.js */ 35574);




/**
 * @name differenceInMinutes
 * @category Minute Helpers
 * @summary Get the number of minutes between the given dates.
 *
 * @description
 * Get the signed number of full (rounded towards 0) minutes between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @param {Object} [options] - an object with options.
 * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
 * @returns {Number} the number of minutes
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
 * const result = differenceInMinutes(
 *   new Date(2014, 6, 2, 12, 20, 0),
 *   new Date(2014, 6, 2, 12, 7, 59)
 * )
 * //=> 12
 *
 * @example
 * // How many minutes are between 10:01:59 and 10:00:00
 * const result = differenceInMinutes(
 *   new Date(2000, 0, 1, 10, 0, 0),
 *   new Date(2000, 0, 1, 10, 1, 59)
 * )
 * //=> -1
 */
function differenceInMinutes(dateLeft, dateRight, options) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var diff = (0,_differenceInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dateLeft, dateRight) / _constants_index_js__WEBPACK_IMPORTED_MODULE_2__.millisecondsInMinute;
  return (0,_lib_roundingMethods_index_js__WEBPACK_IMPORTED_MODULE_3__.getRoundingMethod)(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

/***/ }),

/***/ 7480:
/*!****************************************************************!*\
  !*** ./node_modules/date-fns/esm/differenceInSeconds/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ differenceInSeconds)
/* harmony export */ });
/* harmony import */ var _differenceInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../differenceInMilliseconds/index.js */ 51482);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);
/* harmony import */ var _lib_roundingMethods_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/roundingMethods/index.js */ 35574);



/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @param {Object} [options] - an object with options.
 * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
 * @returns {Number} the number of seconds
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(dateLeft, dateRight, options) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var diff = (0,_differenceInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dateLeft, dateRight) / 1000;
  return (0,_lib_roundingMethods_index_js__WEBPACK_IMPORTED_MODULE_2__.getRoundingMethod)(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

/***/ }),

/***/ 4512:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/endOfDay/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ endOfDay)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the end of a day
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

/***/ }),

/***/ 72775:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/endOfMonth/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ endOfMonth)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the end of a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfMonth(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/***/ }),

/***/ 12478:
/*!******************************************************!*\
  !*** ./node_modules/date-fns/esm/endOfWeek/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ endOfWeek)
/* harmony export */ });
/* harmony import */ var _lib_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/defaultOptions/index.js */ 80373);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);




/**
 * @name endOfWeek
 * @category Week Helpers
 * @summary Return the end of a week for the given date.
 *
 * @description
 * Return the end of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @param {Object} [options] - an object with options.
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the end of a week
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 *
 * @example
 * // The end of a week for 2 September 2014 11:55:00:
 * const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sat Sep 06 2014 23:59:59.999
 *
 * @example
 * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
 * const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Sun Sep 07 2014 23:59:59.999
 */
function endOfWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var defaultOptions = (0,_lib_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__.getDefaultOptions)();
  var weekStartsOn = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

/***/ }),

/***/ 23966:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/getDate/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDate)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getDate
 * @category Day Helpers
 * @summary Get the day of the month of the given date.
 *
 * @description
 * Get the day of the month of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the day of month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which day of the month is 29 February 2012?
 * const result = getDate(new Date(2012, 1, 29))
 * //=> 29
 */
function getDate(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var dayOfMonth = date.getDate();
  return dayOfMonth;
}

/***/ }),

/***/ 12040:
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/getDay/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDay)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getDay
 * @category Weekday Helpers
 * @summary Get the day of the week of the given date.
 *
 * @description
 * Get the day of the week of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {0|1|2|3|4|5|6} the day of week, 0 represents Sunday
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which day of the week is 29 February 2012?
 * const result = getDay(new Date(2012, 1, 29))
 * //=> 3
 */
function getDay(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var day = date.getDay();
  return day;
}

/***/ }),

/***/ 90091:
/*!***********************************************************!*\
  !*** ./node_modules/date-fns/esm/getDaysInMonth/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDaysInMonth)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getDaysInMonth
 * @category Month Helpers
 * @summary Get the number of days in a month of the given date.
 *
 * @description
 * Get the number of days in a month of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the number of days in a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // How many days are in February 2000?
 * const result = getDaysInMonth(new Date(2000, 1))
 * //=> 29
 */
function getDaysInMonth(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var year = date.getFullYear();
  var monthIndex = date.getMonth();
  var lastDayOfMonth = new Date(0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

/***/ }),

/***/ 22487:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/getHours/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHours)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getHours
 * @category Hour Helpers
 * @summary Get the hours of the given date.
 *
 * @description
 * Get the hours of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the hours
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Get the hours of 29 February 2012 11:45:00:
 * const result = getHours(new Date(2012, 1, 29, 11, 45))
 * //=> 11
 */
function getHours(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var hours = date.getHours();
  return hours;
}

/***/ }),

/***/ 37564:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/getISOWeek/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getISOWeek)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfISOWeek/index.js */ 48971);
/* harmony import */ var _startOfISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../startOfISOWeekYear/index.js */ 23010);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);




var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @name getISOWeek
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the ISO week
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * const result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var diff = (0,_startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(date).getTime() - (0,_startOfISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(date).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

/***/ }),

/***/ 42403:
/*!***********************************************************!*\
  !*** ./node_modules/date-fns/esm/getISOWeekYear/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getISOWeekYear)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfISOWeek/index.js */ 48971);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name getISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the ISO week-numbering year
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * const result = getISOWeekYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOWeekYear(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var year = date.getFullYear();
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = (0,_startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = (0,_startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

/***/ }),

/***/ 42827:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/getMinutes/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMinutes)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getMinutes
 * @category Minute Helpers
 * @summary Get the minutes of the given date.
 *
 * @description
 * Get the minutes of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the minutes
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Get the minutes of 29 February 2012 11:45:05:
 * const result = getMinutes(new Date(2012, 1, 29, 11, 45, 5))
 * //=> 45
 */
function getMinutes(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var minutes = date.getMinutes();
  return minutes;
}

/***/ }),

/***/ 51032:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/getMonth/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMonth)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getMonth
 * @category Month Helpers
 * @summary Get the month of the given date.
 *
 * @description
 * Get the month of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which month is 29 February 2012?
 * const result = getMonth(new Date(2012, 1, 29))
 * //=> 1
 */
function getMonth(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var month = date.getMonth();
  return month;
}

/***/ }),

/***/ 63536:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/getYear/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getYear)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name getYear
 * @category Year Helpers
 * @summary Get the year of the given date.
 *
 * @description
 * Get the year of the given date.
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the year
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which year is 2 July 2014?
 * const result = getYear(new Date(2014, 6, 2))
 * //=> 2014
 */
function getYear(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  return (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate).getFullYear();
}

/***/ }),

/***/ 77393:
/*!******************************************************!*\
  !*** ./node_modules/date-fns/esm/isSameDay/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isSameDay)
/* harmony export */ });
/* harmony import */ var _startOfDay_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../startOfDay/index.js */ 57016);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name isSameDay
 * @category Day Helpers
 * @summary Are the given dates in the same day (and year and month)?
 *
 * @description
 * Are the given dates in the same day (and year and month)?
 *
 * @param {Date|Number} dateLeft - the first date to check
 * @param {Date|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same day (and year and month)
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 18, 0))
 * //=> true
 *
 * @example
 * // Are 4 September and 4 October in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2014, 9, 4))
 * //=> false
 *
 * @example
 * // Are 4 September, 2014 and 4 September, 2015 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2015, 8, 4))
 * //=> false
 */
function isSameDay(dirtyDateLeft, dirtyDateRight) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var dateLeftStartOfDay = (0,_startOfDay_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateLeft);
  var dateRightStartOfDay = (0,_startOfDay_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateRight);
  return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
}

/***/ }),

/***/ 52665:
/*!********************************************************!*\
  !*** ./node_modules/date-fns/esm/isSameMonth/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isSameMonth)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name isSameMonth
 * @category Month Helpers
 * @summary Are the given dates in the same month (and year)?
 *
 * @description
 * Are the given dates in the same month (and year)?
 *
 * @param {Date|Number} dateLeft - the first date to check
 * @param {Date|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same month (and year)
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Are 2 September 2014 and 25 September 2014 in the same month?
 * const result = isSameMonth(new Date(2014, 8, 2), new Date(2014, 8, 25))
 * //=> true
 *
 * @example
 * // Are 2 September 2014 and 25 September 2015 in the same month?
 * const result = isSameMonth(new Date(2014, 8, 2), new Date(2015, 8, 25))
 * //=> false
 */
function isSameMonth(dirtyDateLeft, dirtyDateRight) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var dateLeft = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateLeft);
  var dateRight = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear() && dateLeft.getMonth() === dateRight.getMonth();
}

/***/ }),

/***/ 11568:
/*!*********************************************************!*\
  !*** ./node_modules/date-fns/esm/isSameSecond/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isSameSecond)
/* harmony export */ });
/* harmony import */ var _startOfSecond_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../startOfSecond/index.js */ 32805);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name isSameSecond
 * @category Second Helpers
 * @summary Are the given dates in the same second (and hour and day)?
 *
 * @description
 * Are the given dates in the same second (and hour and day)?
 *
 * @param {Date|Number} dateLeft - the first date to check
 * @param {Date|Number} dateRight - the second date to check
 * @returns {Boolean} the dates are in the same second (and hour and day)
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Are 4 September 2014 06:30:15.000 and 4 September 2014 06:30.15.500 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 30, 15),
 *   new Date(2014, 8, 4, 6, 30, 15, 500)
 * )
 * //=> true
 *
 * @example
 * // Are 4 September 2014 06:00:15.000 and 4 September 2014 06:01.15.000 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 0, 15),
 *   new Date(2014, 8, 4, 6, 1, 15)
 * )
 * //=> false
 *
 * @example
 * // Are 4 September 2014 06:00:15.000 and 5 September 2014 06:00.15.000 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 0, 15),
 *   new Date(2014, 8, 5, 6, 0, 15)
 * )
 * //=> false
 */
function isSameSecond(dirtyDateLeft, dirtyDateRight) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var dateLeftStartOfSecond = (0,_startOfSecond_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateLeft);
  var dateRightStartOfSecond = (0,_startOfSecond_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDateRight);
  return dateLeftStartOfSecond.getTime() === dateRightStartOfSecond.getTime();
}

/***/ }),

/***/ 68472:
/*!************************************************!*\
  !*** ./node_modules/date-fns/esm/max/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ max)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ 43445);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name max
 * @category Common Helpers
 * @summary Return the latest of the given dates.
 *
 * @description
 * Return the latest of the given dates.
 *
 * @param {Date[]|Number[]} datesArray - the dates to compare
 * @returns {Date} the latest of the dates
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which of these dates is the latest?
 * const result = max([
 *   new Date(1989, 6, 10),
 *   new Date(1987, 1, 11),
 *   new Date(1995, 6, 2),
 *   new Date(1990, 0, 1)
 * ])
 * //=> Sun Jul 02 1995 00:00:00
 */
function max(dirtyDatesArray) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(1, arguments);
  var datesArray;
  // `dirtyDatesArray` is Array, Set or Map, or object with custom `forEach` method
  if (dirtyDatesArray && typeof dirtyDatesArray.forEach === 'function') {
    datesArray = dirtyDatesArray;

    // If `dirtyDatesArray` is Array-like Object, convert to Array.
  } else if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(dirtyDatesArray) === 'object' && dirtyDatesArray !== null) {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  } else {
    // `dirtyDatesArray` is non-iterable, return Invalid Date
    return new Date(NaN);
  }
  var result;
  datesArray.forEach(function (dirtyDate) {
    var currentDate = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate);
    if (result === undefined || result < currentDate || isNaN(Number(currentDate))) {
      result = currentDate;
    }
  });
  return result || new Date(NaN);
}

/***/ }),

/***/ 97839:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/setDate/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setDate)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name setDate
 * @category Day Helpers
 * @summary Set the day of the month to the given date.
 *
 * @description
 * Set the day of the month to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} dayOfMonth - the day of the month of the new date
 * @returns {Date} the new date with the day of the month set
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Set the 30th day of the month to 1 September 2014:
 * const result = setDate(new Date(2014, 8, 1), 30)
 * //=> Tue Sep 30 2014 00:00:00
 */
function setDate(dirtyDate, dirtyDayOfMonth) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var dayOfMonth = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDayOfMonth);
  date.setDate(dayOfMonth);
  return date;
}

/***/ }),

/***/ 14562:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/setHours/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setHours)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name setHours
 * @category Hour Helpers
 * @summary Set the hours to the given date.
 *
 * @description
 * Set the hours to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} hours - the hours of the new date
 * @returns {Date} the new date with the hours set
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Set 4 hours to 1 September 2014 11:30:00:
 * const result = setHours(new Date(2014, 8, 1, 11, 30), 4)
 * //=> Mon Sep 01 2014 04:30:00
 */
function setHours(dirtyDate, dirtyHours) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var hours = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyHours);
  date.setHours(hours);
  return date;
}

/***/ }),

/***/ 38020:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/setMinutes/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setMinutes)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name setMinutes
 * @category Minute Helpers
 * @summary Set the minutes to the given date.
 *
 * @description
 * Set the minutes to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} minutes - the minutes of the new date
 * @returns {Date} the new date with the minutes set
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Set 45 minutes to 1 September 2014 11:30:40:
 * const result = setMinutes(new Date(2014, 8, 1, 11, 30, 40), 45)
 * //=> Mon Sep 01 2014 11:45:40
 */
function setMinutes(dirtyDate, dirtyMinutes) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var minutes = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyMinutes);
  date.setMinutes(minutes);
  return date;
}

/***/ }),

/***/ 6491:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/setMonth/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setMonth)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _getDaysInMonth_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../getDaysInMonth/index.js */ 90091);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);




/**
 * @name setMonth
 * @category Month Helpers
 * @summary Set the month to the given date.
 *
 * @description
 * Set the month to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} month - the month of the new date
 * @returns {Date} the new date with the month set
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Set February to 1 September 2014:
 * const result = setMonth(new Date(2014, 8, 1), 1)
 * //=> Sat Feb 01 2014 00:00:00
 */
function setMonth(dirtyDate, dirtyMonth) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var month = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyMonth);
  var year = date.getFullYear();
  var day = date.getDate();
  var dateWithDesiredMonth = new Date(0);
  dateWithDesiredMonth.setFullYear(year, month, 15);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  var daysInMonth = (0,_getDaysInMonth_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(dateWithDesiredMonth);
  // Set the last day of the new month
  // if the original date was the last day of the longer month
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}

/***/ }),

/***/ 86868:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/setYear/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setYear)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name setYear
 * @category Year Helpers
 * @summary Set the year to the given date.
 *
 * @description
 * Set the year to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} year - the year of the new date
 * @returns {Date} the new date with the year set
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Set year 2013 to 1 September 2014:
 * const result = setYear(new Date(2014, 8, 1), 2013)
 * //=> Sun Sep 01 2013 00:00:00
 */
function setYear(dirtyDate, dirtyYear) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var year = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyYear);

  // Check if date is Invalid Date because Date.prototype.setFullYear ignores the value of Invalid Date
  if (isNaN(date.getTime())) {
    return new Date(NaN);
  }
  date.setFullYear(year);
  return date;
}

/***/ }),

/***/ 57016:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfDay/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfDay)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of a day
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

/***/ }),

/***/ 48971:
/*!***********************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfISOWeek/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfISOWeek)
/* harmony export */ });
/* harmony import */ var _startOfWeek_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../startOfWeek/index.js */ 97929);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name startOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of an ISO week
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  return (0,_startOfWeek_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate, {
    weekStartsOn: 1
  });
}

/***/ }),

/***/ 23010:
/*!***************************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfISOWeekYear/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfISOWeekYear)
/* harmony export */ });
/* harmony import */ var _getISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../getISOWeekYear/index.js */ 42403);
/* harmony import */ var _startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfISOWeek/index.js */ 48971);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name startOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of an ISO week-numbering year
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * const result = startOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOWeekYear(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var year = (0,_getISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = (0,_startOfISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fourthOfJanuary);
  return date;
}

/***/ }),

/***/ 55702:
/*!**********************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfMinute/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfMinute)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name startOfMinute
 * @category Minute Helpers
 * @summary Return the start of a minute for the given date.
 *
 * @description
 * Return the start of a minute for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of a minute
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of a minute for 1 December 2014 22:15:45.400:
 * const result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:00
 */
function startOfMinute(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  date.setSeconds(0, 0);
  return date;
}

/***/ }),

/***/ 2848:
/*!*********************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfMonth/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfMonth)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name startOfMonth
 * @category Month Helpers
 * @summary Return the start of a month for the given date.
 *
 * @description
 * Return the start of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of a month for 2 September 2014 11:55:00:
 * const result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfMonth(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/***/ }),

/***/ 32805:
/*!**********************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfSecond/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfSecond)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name startOfSecond
 * @category Second Helpers
 * @summary Return the start of a second for the given date.
 *
 * @description
 * Return the start of a second for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of a second
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of a second for 1 December 2014 22:15:45.400:
 * const result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:45.000
 */
function startOfSecond(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  date.setMilliseconds(0);
  return date;
}

/***/ }),

/***/ 97929:
/*!********************************************************!*\
  !*** ./node_modules/date-fns/esm/startOfWeek/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfWeek)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../toDate/index.js */ 47120);
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);
/* harmony import */ var _lib_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/defaultOptions/index.js */ 80373);




/**
 * @name startOfWeek
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @param {Object} [options] - an object with options.
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the start of a week
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var defaultOptions = (0,_lib_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__.getDefaultOptions)();
  var weekStartsOn = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/***/ }),

/***/ 7902:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/subDays/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ subDays)
/* harmony export */ });
/* harmony import */ var _addDays_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addDays/index.js */ 65822);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);



/**
 * @name subDays
 * @category Day Helpers
 * @summary Subtract the specified number of days from the given date.
 *
 * @description
 * Subtract the specified number of days from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the days subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 10 days from 1 September 2014:
 * const result = subDays(new Date(2014, 8, 1), 10)
 * //=> Fri Aug 22 2014 00:00:00
 */
function subDays(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addDays_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, -amount);
}

/***/ }),

/***/ 8744:
/*!******************************************************!*\
  !*** ./node_modules/date-fns/esm/subMonths/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ subMonths)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _addMonths_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addMonths/index.js */ 81435);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name subMonths
 * @category Month Helpers
 * @summary Subtract the specified number of months from the given date.
 *
 * @description
 * Subtract the specified number of months from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 5 months from 1 February 2015:
 * const result = subMonths(new Date(2015, 1, 1), 5)
 * //=> Mon Sep 01 2014 00:00:00
 */
function subMonths(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addMonths_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, -amount);
}

/***/ }),

/***/ 27506:
/*!*****************************************************!*\
  !*** ./node_modules/date-fns/esm/subWeeks/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ subWeeks)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ 21578);
/* harmony import */ var _addWeeks_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addWeeks/index.js */ 75930);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);



/**
 * @name subWeeks
 * @category Week Helpers
 * @summary Subtract the specified number of weeks from the given date.
 *
 * @description
 * Subtract the specified number of weeks from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of weeks to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the weeks subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 4 weeks from 1 September 2014:
 * const result = subWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Aug 04 2014 00:00:00
 */
function subWeeks(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addWeeks_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, -amount);
}

/***/ }),

/***/ 47120:
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/toDate/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ 43445);
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ 67265);


/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(1, arguments);
  var argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (argument instanceof Date || (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(argument) === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      // eslint-disable-next-line no-console
      console.warn(new Error().stack);
    }
    return new Date(NaN);
  }
}

/***/ }),

/***/ 59055:
/*!************************************************!*\
  !*** ./node_modules/positioning/dist/entry.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   positionElements: () => (/* reexport safe */ _positioning__WEBPACK_IMPORTED_MODULE_0__.positionElements)
/* harmony export */ });
/* harmony import */ var _positioning__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./positioning */ 71546);


/***/ }),

/***/ 71546:
/*!******************************************************!*\
  !*** ./node_modules/positioning/dist/positioning.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Positioning: () => (/* binding */ Positioning),
/* harmony export */   positionElements: () => (/* binding */ positionElements)
/* harmony export */ });
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
var Positioning = /** @class */function () {
  function Positioning() {}
  Positioning.prototype.getAllStyles = function (element) {
    return window.getComputedStyle(element);
  };
  Positioning.prototype.getStyle = function (element, prop) {
    return this.getAllStyles(element)[prop];
  };
  Positioning.prototype.isStaticPositioned = function (element) {
    return (this.getStyle(element, 'position') || 'static') === 'static';
  };
  Positioning.prototype.offsetParent = function (element) {
    var offsetParentEl = element.offsetParent || document.documentElement;
    while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
      offsetParentEl = offsetParentEl.offsetParent;
    }
    return offsetParentEl || document.documentElement;
  };
  Positioning.prototype.position = function (element, round) {
    if (round === void 0) {
      round = true;
    }
    var elPosition;
    var parentOffset = {
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    if (this.getStyle(element, 'position') === 'fixed') {
      elPosition = element.getBoundingClientRect();
      elPosition = {
        top: elPosition.top,
        bottom: elPosition.bottom,
        left: elPosition.left,
        right: elPosition.right,
        height: elPosition.height,
        width: elPosition.width
      };
    } else {
      var offsetParentEl = this.offsetParent(element);
      elPosition = this.offset(element, false);
      if (offsetParentEl !== document.documentElement) {
        parentOffset = this.offset(offsetParentEl, false);
      }
      parentOffset.top += offsetParentEl.clientTop;
      parentOffset.left += offsetParentEl.clientLeft;
    }
    elPosition.top -= parentOffset.top;
    elPosition.bottom -= parentOffset.top;
    elPosition.left -= parentOffset.left;
    elPosition.right -= parentOffset.left;
    if (round) {
      elPosition.top = Math.round(elPosition.top);
      elPosition.bottom = Math.round(elPosition.bottom);
      elPosition.left = Math.round(elPosition.left);
      elPosition.right = Math.round(elPosition.right);
    }
    return elPosition;
  };
  Positioning.prototype.offset = function (element, round) {
    if (round === void 0) {
      round = true;
    }
    var elBcr = element.getBoundingClientRect();
    var viewportOffset = {
      top: window.pageYOffset - document.documentElement.clientTop,
      left: window.pageXOffset - document.documentElement.clientLeft
    };
    var elOffset = {
      height: elBcr.height || element.offsetHeight,
      width: elBcr.width || element.offsetWidth,
      top: elBcr.top + viewportOffset.top,
      bottom: elBcr.bottom + viewportOffset.top,
      left: elBcr.left + viewportOffset.left,
      right: elBcr.right + viewportOffset.left
    };
    if (round) {
      elOffset.height = Math.round(elOffset.height);
      elOffset.width = Math.round(elOffset.width);
      elOffset.top = Math.round(elOffset.top);
      elOffset.bottom = Math.round(elOffset.bottom);
      elOffset.left = Math.round(elOffset.left);
      elOffset.right = Math.round(elOffset.right);
    }
    return elOffset;
  };
  /*
    Return false if the element to position is outside the viewport
  */
  Positioning.prototype.positionElements = function (hostElement, targetElement, placement, appendToBody) {
    var _a = placement.split('-'),
      _b = _a[0],
      placementPrimary = _b === void 0 ? 'top' : _b,
      _c = _a[1],
      placementSecondary = _c === void 0 ? 'center' : _c;
    var hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
    var targetElStyles = this.getAllStyles(targetElement);
    var marginTop = parseFloat(targetElStyles.marginTop);
    var marginBottom = parseFloat(targetElStyles.marginBottom);
    var marginLeft = parseFloat(targetElStyles.marginLeft);
    var marginRight = parseFloat(targetElStyles.marginRight);
    var topPosition = 0;
    var leftPosition = 0;
    switch (placementPrimary) {
      case 'top':
        topPosition = hostElPosition.top - (targetElement.offsetHeight + marginTop + marginBottom);
        break;
      case 'bottom':
        topPosition = hostElPosition.top + hostElPosition.height;
        break;
      case 'left':
        leftPosition = hostElPosition.left - (targetElement.offsetWidth + marginLeft + marginRight);
        break;
      case 'right':
        leftPosition = hostElPosition.left + hostElPosition.width;
        break;
    }
    switch (placementSecondary) {
      case 'top':
        topPosition = hostElPosition.top;
        break;
      case 'bottom':
        topPosition = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
        break;
      case 'left':
        leftPosition = hostElPosition.left;
        break;
      case 'right':
        leftPosition = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
        break;
      case 'center':
        if (placementPrimary === 'top' || placementPrimary === 'bottom') {
          leftPosition = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
        } else {
          topPosition = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
        }
        break;
    }
    /// The translate3d/gpu acceleration render a blurry text on chrome, the next line is commented until a browser fix
    // targetElement.style.transform = `translate3d(${Math.round(leftPosition)}px, ${Math.floor(topPosition)}px, 0px)`;
    targetElement.style.transform = "translate(" + Math.round(leftPosition) + "px, " + Math.round(topPosition) + "px)";
    // Check if the targetElement is inside the viewport
    var targetElBCR = targetElement.getBoundingClientRect();
    var html = document.documentElement;
    var windowHeight = window.innerHeight || html.clientHeight;
    var windowWidth = window.innerWidth || html.clientWidth;
    return targetElBCR.left >= 0 && targetElBCR.top >= 0 && targetElBCR.right <= windowWidth && targetElBCR.bottom <= windowHeight;
  };
  return Positioning;
}();

var placementSeparator = /\s+/;
var positionService = new Positioning();
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'left', 'right',
 *   'top-left', 'top-right',
 *   'bottom-left', 'bottom-right',
 *   'left-top', 'left-bottom',
 *   'right-top', 'right-bottom'.
 * */
function positionElements(hostElement, targetElement, placement, appendToBody, baseClass) {
  var placementVals = Array.isArray(placement) ? placement : placement.split(placementSeparator);
  var allowedPlacements = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-top', 'left-bottom', 'right-top', 'right-bottom'];
  var classList = targetElement.classList;
  var addClassesToTarget = function (targetPlacement) {
    var _a = targetPlacement.split('-'),
      primary = _a[0],
      secondary = _a[1];
    var classes = [];
    if (baseClass) {
      classes.push(baseClass + "-" + primary);
      if (secondary) {
        classes.push(baseClass + "-" + primary + "-" + secondary);
      }
      classes.forEach(function (classname) {
        classList.add(classname);
      });
    }
    return classes;
  };
  // Remove old placement classes to avoid issues
  if (baseClass) {
    allowedPlacements.forEach(function (placementToRemove) {
      classList.remove(baseClass + "-" + placementToRemove);
    });
  }
  // replace auto placement with other placements
  var hasAuto = placementVals.findIndex(function (val) {
    return val === 'auto';
  });
  if (hasAuto >= 0) {
    allowedPlacements.forEach(function (obj) {
      if (placementVals.find(function (val) {
        return val.search('^' + obj) !== -1;
      }) == null) {
        placementVals.splice(hasAuto++, 1, obj);
      }
    });
  }
  // coordinates where to position
  // Required for transform:
  var style = targetElement.style;
  style.position = 'absolute';
  style.top = '0';
  style.left = '0';
  style['will-change'] = 'transform';
  var testPlacement;
  var isInViewport = false;
  for (var _i = 0, placementVals_1 = placementVals; _i < placementVals_1.length; _i++) {
    testPlacement = placementVals_1[_i];
    var addedClasses = addClassesToTarget(testPlacement);
    if (positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody)) {
      isInViewport = true;
      break;
    }
    // Remove the baseClasses for further calculation
    if (baseClass) {
      addedClasses.forEach(function (classname) {
        classList.remove(classname);
      });
    }
  }
  if (!isInViewport) {
    // If nothing match, the first placement is the default one
    testPlacement = placementVals[0];
    addClassesToTarget(testPlacement);
    positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody);
  }
  return testPlacement;
}

/***/ }),

/***/ 82053:
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/count.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   count: () => (/* binding */ count)
/* harmony export */ });
/* harmony import */ var _reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reduce */ 65091);

function count(predicate) {
  return (0,_reduce__WEBPACK_IMPORTED_MODULE_0__.reduce)((total, value, i) => !predicate || predicate(value, i) ? total + 1 : total, 0);
}

/***/ }),

/***/ 65091:
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/reduce.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reduce: () => (/* binding */ reduce)
/* harmony export */ });
/* harmony import */ var _scanInternals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scanInternals */ 47938);
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ 34114);


function reduce(accumulator, seed) {
  return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)((0,_scanInternals__WEBPACK_IMPORTED_MODULE_1__.scanInternals)(accumulator, seed, arguments.length >= 2, false, true));
}

/***/ }),

/***/ 30025:
/*!**********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/switchMapTo.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   switchMapTo: () => (/* binding */ switchMapTo)
/* harmony export */ });
/* harmony import */ var _switchMap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./switchMap */ 81891);
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isFunction */ 82602);


function switchMapTo(innerObservable, resultSelector) {
  return (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(resultSelector) ? (0,_switchMap__WEBPACK_IMPORTED_MODULE_1__.switchMap)(() => innerObservable, resultSelector) : (0,_switchMap__WEBPACK_IMPORTED_MODULE_1__.switchMap)(() => innerObservable);
}

/***/ }),

/***/ 82882:
/*!*********************************************************************!*\
  !*** ./node_modules/angular-calendar/fesm2020/angular-calendar.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarA11y: () => (/* binding */ CalendarA11y),
/* harmony export */   CalendarAngularDateFormatter: () => (/* binding */ CalendarAngularDateFormatter),
/* harmony export */   CalendarCommonModule: () => (/* binding */ CalendarCommonModule),
/* harmony export */   CalendarDateFormatter: () => (/* binding */ CalendarDateFormatter),
/* harmony export */   CalendarDayModule: () => (/* binding */ CalendarDayModule),
/* harmony export */   CalendarDayViewComponent: () => (/* binding */ CalendarDayViewComponent),
/* harmony export */   CalendarEventTimesChangedEventType: () => (/* binding */ CalendarEventTimesChangedEventType),
/* harmony export */   CalendarEventTitleFormatter: () => (/* binding */ CalendarEventTitleFormatter),
/* harmony export */   CalendarModule: () => (/* binding */ CalendarModule),
/* harmony export */   CalendarMomentDateFormatter: () => (/* binding */ CalendarMomentDateFormatter),
/* harmony export */   CalendarMonthModule: () => (/* binding */ CalendarMonthModule),
/* harmony export */   CalendarMonthViewComponent: () => (/* binding */ CalendarMonthViewComponent),
/* harmony export */   CalendarNativeDateFormatter: () => (/* binding */ CalendarNativeDateFormatter),
/* harmony export */   CalendarUtils: () => (/* binding */ CalendarUtils),
/* harmony export */   CalendarView: () => (/* binding */ CalendarView),
/* harmony export */   CalendarWeekModule: () => (/* binding */ CalendarWeekModule),
/* harmony export */   CalendarWeekViewComponent: () => (/* binding */ CalendarWeekViewComponent),
/* harmony export */   DAYS_OF_WEEK: () => (/* reexport safe */ calendar_utils__WEBPACK_IMPORTED_MODULE_1__.DAYS_OF_WEEK),
/* harmony export */   DateAdapter: () => (/* binding */ DateAdapter),
/* harmony export */   MOMENT: () => (/* binding */ MOMENT),
/* harmony export */   collapseAnimation: () => (/* binding */ collapseAnimation),
/* harmony export */   getWeekViewPeriod: () => (/* binding */ getWeekViewPeriod),
/* harmony export */   "ɵCalendarA11yPipe": () => (/* binding */ CalendarA11yPipe),
/* harmony export */   "ɵCalendarDatePipe": () => (/* binding */ CalendarDatePipe),
/* harmony export */   "ɵCalendarEventActionsComponent": () => (/* binding */ CalendarEventActionsComponent),
/* harmony export */   "ɵCalendarEventTitleComponent": () => (/* binding */ CalendarEventTitleComponent),
/* harmony export */   "ɵCalendarEventTitlePipe": () => (/* binding */ CalendarEventTitlePipe),
/* harmony export */   "ɵCalendarMonthCellComponent": () => (/* binding */ CalendarMonthCellComponent),
/* harmony export */   "ɵCalendarMonthViewHeaderComponent": () => (/* binding */ CalendarMonthViewHeaderComponent),
/* harmony export */   "ɵCalendarNextViewDirective": () => (/* binding */ CalendarNextViewDirective),
/* harmony export */   "ɵCalendarOpenDayEventsComponent": () => (/* binding */ CalendarOpenDayEventsComponent),
/* harmony export */   "ɵCalendarPreviousViewDirective": () => (/* binding */ CalendarPreviousViewDirective),
/* harmony export */   "ɵCalendarTodayDirective": () => (/* binding */ CalendarTodayDirective),
/* harmony export */   "ɵCalendarTooltipDirective": () => (/* binding */ CalendarTooltipDirective),
/* harmony export */   "ɵCalendarTooltipWindowComponent": () => (/* binding */ CalendarTooltipWindowComponent),
/* harmony export */   "ɵCalendarWeekViewCurrentTimeMarkerComponent": () => (/* binding */ CalendarWeekViewCurrentTimeMarkerComponent),
/* harmony export */   "ɵCalendarWeekViewEventComponent": () => (/* binding */ CalendarWeekViewEventComponent),
/* harmony export */   "ɵCalendarWeekViewHeaderComponent": () => (/* binding */ CalendarWeekViewHeaderComponent),
/* harmony export */   "ɵCalendarWeekViewHourSegmentComponent": () => (/* binding */ CalendarWeekViewHourSegmentComponent),
/* harmony export */   "ɵClickDirective": () => (/* binding */ ClickDirective),
/* harmony export */   "ɵKeydownEnterDirective": () => (/* binding */ KeydownEnterDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 12235);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 89378);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 13379);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 20274);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 81891);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 30025);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var positioning__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! positioning */ 59055);
/* harmony import */ var calendar_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! calendar-utils */ 27914);
/* harmony import */ var angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angular-draggable-droppable */ 60624);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/animations */ 12501);
/* harmony import */ var angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! angular-resizable-element */ 9175);














const _c0 = a0 => ({
  action: a0
});
function CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template_a_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const action_r7 = restoredCtx.$implicit;
      const event_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).event;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](action_r7.onClick({
        event: event_r3,
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template_a_mwlKeydownEnter_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const action_r7 = restoredCtx.$implicit;
      const event_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).event;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](action_r7.onClick({
        event: event_r3,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const action_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", action_r7.cssClass)("innerHtml", action_r7.label, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 3, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c0, action_r7), "actionButtonLabel"));
  }
}
function CalendarEventActionsComponent_ng_template_0_span_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template, 2, 8, "a", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const event_r3 = ctx_r13.event;
    const trackByActionId_r4 = ctx_r13.trackByActionId;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", event_r3.actions)("ngForTrackBy", trackByActionId_r4);
  }
}
function CalendarEventActionsComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarEventActionsComponent_ng_template_0_span_0_Template, 2, 2, "span", 2);
  }
  if (rf & 2) {
    const event_r3 = ctx.event;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", event_r3.actions);
  }
}
function CalendarEventActionsComponent_ng_template_2_Template(rf, ctx) {}
const _c1 = (a0, a1) => ({
  event: a0,
  trackByActionId: a1
});
const _c2 = () => ({});
function CalendarEventTitleComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "span", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarEventTitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
  }
  if (rf & 2) {
    const event_r3 = ctx.event;
    const view_r4 = ctx.view;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("innerHTML", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](1, 2, event_r3.title, view_r4, event_r3), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-hidden", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 6, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](9, _c2), "hideEventTitle"));
  }
}
function CalendarEventTitleComponent_ng_template_2_Template(rf, ctx) {}
const _c3 = (a0, a1) => ({
  event: a0,
  view: a1
});
function CalendarTooltipWindowComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 3)(2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const contents_r3 = ctx.contents;
    const placement_r4 = ctx.placement;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", "cal-tooltip-" + placement_r4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("innerHtml", contents_r3, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
  }
}
function CalendarTooltipWindowComponent_ng_template_2_Template(rf, ctx) {}
const _c4 = (a0, a1, a2) => ({
  contents: a0,
  placement: a1,
  event: a2
});
function CalendarMonthCellComponent_ng_template_0_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const day_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().day;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](day_r3.badgeTotal);
  }
}
const _c5 = a0 => ({
  backgroundColor: a0
});
const _c6 = (a0, a1) => ({
  event: a0,
  draggedFrom: a1
});
const _c7 = (a0, a1) => ({
  x: a0,
  y: a1
});
const _c8 = () => ({
  delay: 300,
  delta: 30
});
function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mouseenter", function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template_div_mouseenter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const event_r19 = restoredCtx.$implicit;
      const highlightDay_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).highlightDay;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](highlightDay_r7.emit({
        event: event_r19
      }));
    })("mouseleave", function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template_div_mouseleave_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const event_r19 = restoredCtx.$implicit;
      const unhighlightDay_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).unhighlightDay;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](unhighlightDay_r8.emit({
        event: event_r19
      }));
    })("mwlClick", function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template_div_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const event_r19 = restoredCtx.$implicit;
      const eventClicked_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r9.emit({
        event: event_r19,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarEventTitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const event_r19 = ctx.$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    const tooltipPlacement_r6 = ctx_r27.tooltipPlacement;
    const tooltipTemplate_r10 = ctx_r27.tooltipTemplate;
    const tooltipAppendToBody_r11 = ctx_r27.tooltipAppendToBody;
    const tooltipDelay_r12 = ctx_r27.tooltipDelay;
    const day_r3 = ctx_r27.day;
    const validateDrag_r14 = ctx_r27.validateDrag;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", event_r19.draggable);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](22, _c5, event_r19.color == null ? null : event_r19.color.primary))("ngClass", event_r19 == null ? null : event_r19.cssClass)("mwlCalendarTooltip", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](1, 15, event_r19.title, "monthTooltip", event_r19))("tooltipPlacement", tooltipPlacement_r6)("tooltipEvent", event_r19)("tooltipTemplate", tooltipTemplate_r10)("tooltipAppendToBody", tooltipAppendToBody_r11)("tooltipDelay", tooltipDelay_r12)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](24, _c6, event_r19, day_r3))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](27, _c7, event_r19.draggable, event_r19.draggable))("validateDrag", validateDrag_r14)("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](30, _c8));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-hidden", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 19, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](31, _c2), "hideMonthCellEvents"));
  }
}
function CalendarMonthCellComponent_ng_template_0_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template, 3, 32, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const day_r3 = ctx_r28.day;
    const trackByEventId_r13 = ctx_r28.trackByEventId;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", day_r3.events)("ngForTrackBy", trackByEventId_r13);
  }
}
const _c9 = (a0, a1) => ({
  day: a0,
  locale: a1
});
function CalendarMonthCellComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarMonthCellComponent_ng_template_0_span_3_Template, 2, 1, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](6, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, CalendarMonthCellComponent_ng_template_0_div_7_Template, 2, 2, "div", 6);
  }
  if (rf & 2) {
    const day_r3 = ctx.day;
    const locale_r5 = ctx.locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 4, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](11, _c9, day_r3, locale_r5), "monthCell"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", day_r3.badgeTotal > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](6, 7, day_r3.date, "monthViewDayNumber", locale_r5));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", day_r3.events.length > 0);
  }
}
function CalendarMonthCellComponent_ng_template_2_Template(rf, ctx) {}
const _c10 = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) => ({
  day: a0,
  openDay: a1,
  locale: a2,
  tooltipPlacement: a3,
  highlightDay: a4,
  unhighlightDay: a5,
  eventClicked: a6,
  tooltipTemplate: a7,
  tooltipAppendToBody: a8,
  tooltipDelay: a9,
  trackByEventId: a10,
  validateDrag: a11
});
const _c11 = a0 => ({
  event: a0
});
const _c12 = (a0, a1) => ({
  event: a0,
  locale: a1
});
function CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mwl-calendar-event-title", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template_mwl_calendar_event_title_mwlClick_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const event_r10 = restoredCtx.$implicit;
      const eventClicked_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r4.emit({
        event: event_r10,
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template_mwl_calendar_event_title_mwlKeydownEnter_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const event_r10 = restoredCtx.$implicit;
      const eventClicked_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r4.emit({
        event: event_r10,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "mwl-calendar-event-actions", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const event_r10 = ctx.$implicit;
    const validateDrag_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).validateDrag;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", event_r10.draggable);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", event_r10 == null ? null : event_r10.cssClass)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](16, _c11, event_r10))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](18, _c7, event_r10.draggable, event_r10.draggable))("validateDrag", validateDrag_r7)("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](21, _c8));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](22, _c5, event_r10.color == null ? null : event_r10.color.primary));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", event_r10)("customTemplate", ctx_r9.eventTitleTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](4, 13, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](24, _c12, event_r10, ctx_r9.locale), "eventDescription"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", event_r10)("customTemplate", ctx_r9.eventActionsTemplate);
  }
}
const _c13 = (a0, a1) => ({
  date: a0,
  locale: a1
});
function CalendarOpenDayEventsComponent_ng_template_0_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template, 7, 27, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const events_r3 = ctx_r17.events;
    const trackByEventId_r6 = ctx_r17.trackByEventId;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("@collapse", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 5, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](11, _c13, ctx_r8.date, ctx_r8.locale), "openDayEventsAlert"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](4, 8, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](14, _c13, ctx_r8.date, ctx_r8.locale), "openDayEventsLandmark"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", events_r3)("ngForTrackBy", trackByEventId_r6);
  }
}
function CalendarOpenDayEventsComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarOpenDayEventsComponent_ng_template_0_div_0_Template, 6, 17, "div", 2);
  }
  if (rf & 2) {
    const isOpen_r5 = ctx.isOpen;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", isOpen_r5);
  }
}
function CalendarOpenDayEventsComponent_ng_template_2_Template(rf, ctx) {}
const _c14 = (a0, a1, a2, a3, a4) => ({
  events: a0,
  eventClicked: a1,
  isOpen: a2,
  trackByEventId: a3,
  validateDrag: a4
});
function CalendarMonthViewHeaderComponent_ng_template_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarMonthViewHeaderComponent_ng_template_0_div_1_Template_div_click_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9);
      const day_r7 = restoredCtx.$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r8.columnHeaderClicked.emit({
        isoDayNumber: day_r7.day,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const day_r7 = ctx.$implicit;
    const locale_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-past", day_r7.isPast)("cal-today", day_r7.isToday)("cal-future", day_r7.isFuture)("cal-weekend", day_r7.isWeekend);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", day_r7.cssClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](2, 10, day_r7.date, "monthViewColumnHeader", locale_r4), " ");
  }
}
function CalendarMonthViewHeaderComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarMonthViewHeaderComponent_ng_template_0_div_1_Template, 3, 14, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const days_r3 = ctx.days;
    const trackByWeekDayHeaderDate_r5 = ctx.trackByWeekDayHeaderDate;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", days_r3)("ngForTrackBy", trackByWeekDayHeaderDate_r5);
  }
}
function CalendarMonthViewHeaderComponent_ng_template_2_Template(rf, ctx) {}
const _c15 = (a0, a1, a2) => ({
  days: a0,
  locale: a1,
  trackByWeekDayHeaderDate: a2
});
function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-month-cell", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const day_r3 = restoredCtx.$implicit;
      const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r4.dayClicked.emit({
        day: day_r3,
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_mwlKeydownEnter_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const day_r3 = restoredCtx.$implicit;
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r6.dayClicked.emit({
        day: day_r3,
        sourceEvent: $event
      }));
    })("highlightDay", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_highlightDay_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r7.toggleDayHighlight($event.event, true));
    })("unhighlightDay", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_unhighlightDay_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r8.toggleDayHighlight($event.event, false));
    })("drop", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const day_r3 = restoredCtx.$implicit;
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r9.eventDropped(day_r3, $event.dropData.event, $event.dropData.draggedFrom));
    })("eventClicked", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r10.eventClicked.emit({
        event: $event.event,
        sourceEvent: $event.sourceEvent
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const day_r3 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", day_r3 == null ? null : day_r3.cssClass)("day", day_r3)("openDay", ctx_r2.openDay)("locale", ctx_r2.locale)("tooltipPlacement", ctx_r2.tooltipPlacement)("tooltipAppendToBody", ctx_r2.tooltipAppendToBody)("tooltipTemplate", ctx_r2.tooltipTemplate)("tooltipDelay", ctx_r2.tooltipDelay)("customTemplate", ctx_r2.cellTemplate)("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](15, _c5, day_r3.backgroundColor))("clickListenerDisabled", ctx_r2.dayClicked.observers.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("tabindex", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 12, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](17, _c2), "monthCellTabIndex"));
  }
}
function CalendarMonthViewComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div")(1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template, 2, 18, "mwl-calendar-month-cell", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mwl-calendar-open-day-events", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarMonthViewComponent_div_3_Template_mwl_calendar_open_day_events_eventClicked_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r11.eventClicked.emit({
        event: $event.event,
        sourceEvent: $event.sourceEvent
      }));
    })("drop", function CalendarMonthViewComponent_div_3_Template_mwl_calendar_open_day_events_drop_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r13.eventDropped(ctx_r13.openDay, $event.dropData.event, $event.dropData.draggedFrom));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const rowIndex_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](3, 9, ctx_r0.view.days, rowIndex_r1, rowIndex_r1 + ctx_r0.view.totalDaysVisibleInWeek))("ngForTrackBy", ctx_r0.trackByDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("locale", ctx_r0.locale)("isOpen", ctx_r0.openRowIndex === rowIndex_r1)("events", ctx_r0.openDay == null ? null : ctx_r0.openDay.events)("date", ctx_r0.openDay == null ? null : ctx_r0.openDay.date)("customTemplate", ctx_r0.openDayEventsTemplate)("eventTitleTemplate", ctx_r0.eventTitleTemplate)("eventActionsTemplate", ctx_r0.eventActionsTemplate);
  }
}
function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template_div_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const day_r10 = restoredCtx.$implicit;
      const dayHeaderClicked_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().dayHeaderClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](dayHeaderClicked_r5.emit({
        day: day_r10,
        sourceEvent: $event
      }));
    })("drop", function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template_div_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const day_r10 = restoredCtx.$implicit;
      const eventDropped_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().eventDropped;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventDropped_r6.emit({
        event: $event.dropData.event,
        newStart: day_r10.date
      }));
    })("dragEnter", function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template_div_dragEnter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const day_r10 = restoredCtx.$implicit;
      const dragEnter_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().dragEnter;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](dragEnter_r8.emit({
        date: day_r10.date
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](7, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const day_r10 = ctx.$implicit;
    const locale_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-past", day_r10.isPast)("cal-today", day_r10.isToday)("cal-future", day_r10.isFuture)("cal-weekend", day_r10.isWeekend);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", day_r10.cssClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](3, 11, day_r10.date, "weekViewColumnHeader", locale_r4));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](7, 15, day_r10.date, "weekViewColumnSubHeader", locale_r4));
  }
}
function CalendarWeekViewHeaderComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template, 8, 19, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const days_r3 = ctx.days;
    const trackByWeekDayHeaderDate_r7 = ctx.trackByWeekDayHeaderDate;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", days_r3)("ngForTrackBy", trackByWeekDayHeaderDate_r7);
  }
}
function CalendarWeekViewHeaderComponent_ng_template_2_Template(rf, ctx) {}
const _c16 = (a0, a1, a2, a3, a4, a5) => ({
  days: a0,
  locale: a1,
  dayHeaderClicked: a2,
  eventDropped: a3,
  dragEnter: a4,
  trackByWeekDayHeaderDate: a5
});
const _c17 = (a0, a1, a2) => ({
  color: a0,
  backgroundColor: a1,
  borderColor: a2
});
function CalendarWeekViewEventComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarWeekViewEventComponent_ng_template_0_Template_div_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r13);
      const eventClicked_r5 = restoredCtx.eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r5.emit({
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarWeekViewEventComponent_ng_template_0_Template_div_mwlKeydownEnter_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r13);
      const eventClicked_r5 = restoredCtx.eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r5.emit({
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarEventTitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "mwl-calendar-event-actions", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "mwl-calendar-event-title", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const weekEvent_r3 = ctx.weekEvent;
    const tooltipPlacement_r4 = ctx.tooltipPlacement;
    const tooltipTemplate_r6 = ctx.tooltipTemplate;
    const tooltipAppendToBody_r7 = ctx.tooltipAppendToBody;
    const tooltipDisabled_r8 = ctx.tooltipDisabled;
    const tooltipDelay_r9 = ctx.tooltipDelay;
    const daysInWeek_r11 = ctx.daysInWeek;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](20, _c17, weekEvent_r3.event.color == null ? null : weekEvent_r3.event.color.secondaryText, weekEvent_r3.event.color == null ? null : weekEvent_r3.event.color.secondary, weekEvent_r3.event.color == null ? null : weekEvent_r3.event.color.primary))("mwlCalendarTooltip", !tooltipDisabled_r8 ? _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](1, 13, weekEvent_r3.event.title, daysInWeek_r11 === 1 ? "dayTooltip" : "weekTooltip", weekEvent_r3.tempEvent || weekEvent_r3.event) : "")("tooltipPlacement", tooltipPlacement_r4)("tooltipEvent", weekEvent_r3.tempEvent || weekEvent_r3.event)("tooltipTemplate", tooltipTemplate_r6)("tooltipAppendToBody", tooltipAppendToBody_r7)("tooltipDelay", tooltipDelay_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 17, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](24, _c12, weekEvent_r3.tempEvent || weekEvent_r3.event, ctx_r0.locale), "eventDescription"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", weekEvent_r3.tempEvent || weekEvent_r3.event)("customTemplate", ctx_r0.eventActionsTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", weekEvent_r3.tempEvent || weekEvent_r3.event)("customTemplate", ctx_r0.eventTitleTemplate)("view", daysInWeek_r11 === 1 ? "day" : "week");
  }
}
function CalendarWeekViewEventComponent_ng_template_2_Template(rf, ctx) {}
const _c18 = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => ({
  weekEvent: a0,
  tooltipPlacement: a1,
  eventClicked: a2,
  tooltipTemplate: a3,
  tooltipAppendToBody: a4,
  tooltipDisabled: a5,
  tooltipDelay: a6,
  column: a7,
  daysInWeek: a8
});
function CalendarWeekViewHourSegmentComponent_ng_template_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const segment_r3 = ctx_r9.segment;
    const daysInWeek_r7 = ctx_r9.daysInWeek;
    const locale_r4 = ctx_r9.locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](2, 1, segment_r3.displayDate, daysInWeek_r7 === 1 ? "dayViewHour" : "weekViewHour", locale_r4), " ");
  }
}
function CalendarWeekViewHourSegmentComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewHourSegmentComponent_ng_template_0_div_2_Template, 3, 5, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const segment_r3 = ctx.segment;
    const segmentHeight_r5 = ctx.segmentHeight;
    const isTimeLabel_r6 = ctx.isTimeLabel;
    const daysInWeek_r7 = ctx.daysInWeek;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", segmentHeight_r5, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-hour-start", segment_r3.isStart)("cal-after-hour-start", !segment_r3.isStart);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", segment_r3.cssClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-hidden", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 9, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](12, _c2), daysInWeek_r7 === 1 ? "hideDayHourSegment" : "hideWeekHourSegment"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", isTimeLabel_r6);
  }
}
function CalendarWeekViewHourSegmentComponent_ng_template_2_Template(rf, ctx) {}
const _c19 = (a0, a1, a2, a3, a4) => ({
  segment: a0,
  locale: a1,
  segmentHeight: a2,
  isTimeLabel: a3,
  daysInWeek: a4
});
function CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 3);
  }
  if (rf & 2) {
    const topPx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().topPx;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("top", topPx_r9, "px");
  }
}
function CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_div_0_Template, 1, 2, "div", 2);
  }
  if (rf & 2) {
    const isVisible_r8 = ctx.isVisible;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", isVisible_r8);
  }
}
function CalendarWeekViewCurrentTimeMarkerComponent_ng_template_2_Template(rf, ctx) {}
const _c20 = (a0, a1, a2, a3, a4, a5, a6) => ({
  columnDate: a0,
  dayStartHour: a1,
  dayStartMinute: a2,
  dayEndHour: a3,
  dayEndMinute: a4,
  isVisible: a5,
  topPx: a6
});
function CalendarWeekViewComponent_div_2_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("drop", function CalendarWeekViewComponent_div_2_div_4_Template_div_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9);
      const day_r7 = restoredCtx.$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r8.eventDropped($event, day_r7.date, true));
    })("dragEnter", function CalendarWeekViewComponent_div_2_div_4_Template_div_dragEnter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9);
      const day_r7 = restoredCtx.$implicit;
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r10.dateDragEnter(day_r7.date));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
const _c21 = () => ({
  left: true
});
function CalendarWeekViewComponent_div_2_div_5_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 22);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c21));
  }
}
const _c22 = () => ({
  right: true
});
function CalendarWeekViewComponent_div_2_div_5_div_2_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 23);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c22));
  }
}
const _c23 = (a0, a1) => ({
  left: a0,
  right: a1
});
const _c24 = (a0, a1) => ({
  event: a0,
  calendarId: a1
});
const _c25 = a0 => ({
  x: a0
});
function CalendarWeekViewComponent_div_2_div_5_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 17, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("resizeStart", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_div_resizeStart_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const allDayEvent_r14 = restoredCtx.$implicit;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r18.allDayEventResizeStarted(_r12, allDayEvent_r14, $event));
    })("resizing", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_div_resizing_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const allDayEvent_r14 = restoredCtx.$implicit;
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r20.allDayEventResizing(allDayEvent_r14, $event, ctx_r20.dayColumnWidth));
    })("resizeEnd", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_div_resizeEnd_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const allDayEvent_r14 = restoredCtx.$implicit;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r21.allDayEventResizeEnded(allDayEvent_r14));
    })("dragStart", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_div_dragStart_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const allDayEvent_r14 = restoredCtx.$implicit;
      const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r22.dragStarted(_r12, _r15, allDayEvent_r14, false));
    })("dragging", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_div_dragging_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r23.allDayEventDragMove());
    })("dragEnd", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_div_dragEnd_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const allDayEvent_r14 = restoredCtx.$implicit;
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r24.dragEnded(allDayEvent_r14, $event, ctx_r24.dayColumnWidth));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_2_div_5_div_2_div_2_Template, 1, 2, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mwl-calendar-week-view-event", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarWeekViewComponent_div_2_div_5_div_2_Template_mwl_calendar_week_view_event_eventClicked_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19);
      const allDayEvent_r14 = restoredCtx.$implicit;
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r25.eventClicked.emit({
        event: allDayEvent_r14.event,
        sourceEvent: $event.sourceEvent
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_2_div_5_div_2_div_4_Template, 1, 2, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const allDayEvent_r14 = ctx.$implicit;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", 100 / ctx_r13.days.length * allDayEvent_r14.span, "%")("margin-left", ctx_r13.rtl ? null : 100 / ctx_r13.days.length * allDayEvent_r14.offset, "%")("margin-right", ctx_r13.rtl ? 100 / ctx_r13.days.length * allDayEvent_r14.offset : null, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", allDayEvent_r14.event.draggable && ctx_r13.allDayEventResizes.size === 0)("cal-starts-within-week", !allDayEvent_r14.startsBeforeWeek)("cal-ends-within-week", !allDayEvent_r14.endsAfterWeek);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", allDayEvent_r14.event == null ? null : allDayEvent_r14.event.cssClass)("resizeCursors", ctx_r13.resizeCursors)("resizeSnapGrid", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](33, _c23, ctx_r13.dayColumnWidth, ctx_r13.dayColumnWidth))("validateResize", ctx_r13.validateResize)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](36, _c24, allDayEvent_r14.event, ctx_r13.calendarId))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](39, _c7, allDayEvent_r14.event.draggable && ctx_r13.allDayEventResizes.size === 0, !ctx_r13.snapDraggedEvents && allDayEvent_r14.event.draggable && ctx_r13.allDayEventResizes.size === 0))("dragSnapGrid", ctx_r13.snapDraggedEvents ? _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](42, _c25, ctx_r13.dayColumnWidth) : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](44, _c2))("validateDrag", ctx_r13.validateDrag)("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](45, _c8));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (allDayEvent_r14.event == null ? null : allDayEvent_r14.event.resizable == null ? null : allDayEvent_r14.event.resizable.beforeStart) && !allDayEvent_r14.startsBeforeWeek);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("locale", ctx_r13.locale)("weekEvent", allDayEvent_r14)("tooltipPlacement", ctx_r13.tooltipPlacement)("tooltipTemplate", ctx_r13.tooltipTemplate)("tooltipAppendToBody", ctx_r13.tooltipAppendToBody)("tooltipDelay", ctx_r13.tooltipDelay)("customTemplate", ctx_r13.eventTemplate)("eventTitleTemplate", ctx_r13.eventTitleTemplate)("eventActionsTemplate", ctx_r13.eventActionsTemplate)("daysInWeek", ctx_r13.daysInWeek);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (allDayEvent_r14.event == null ? null : allDayEvent_r14.event.resizable == null ? null : allDayEvent_r14.event.resizable.afterEnd) && !allDayEvent_r14.endsAfterWeek);
  }
}
function CalendarWeekViewComponent_div_2_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 14, 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_2_div_5_div_2_Template, 5, 46, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const eventRow_r11 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", eventRow_r11.row)("ngForTrackBy", ctx_r6.trackByWeekAllDayEvent);
  }
}
function CalendarWeekViewComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 8, 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dragEnter", function CalendarWeekViewComponent_div_2_Template_div_dragEnter_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r27);
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r26.dragEnter("allDay"));
    })("dragLeave", function CalendarWeekViewComponent_div_2_Template_div_dragLeave_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r27);
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r28.dragLeave("allDay"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_2_div_4_Template, 1, 0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, CalendarWeekViewComponent_div_2_div_5_Template, 3, 2, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx_r0.allDayEventsLabelTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r0.days)("ngForTrackBy", ctx_r0.trackByWeekDayHeaderDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r0.view.allDayEventRows)("ngForTrackBy", ctx_r0.trackById);
  }
}
function CalendarWeekViewComponent_div_4_div_1_mwl_calendar_week_view_hour_segment_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mwl-calendar-week-view-hour-segment", 28);
  }
  if (rf & 2) {
    const segment_r33 = ctx.$implicit;
    const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", ctx_r32.hourSegmentHeight, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("segment", segment_r33)("segmentHeight", ctx_r32.hourSegmentHeight)("locale", ctx_r32.locale)("customTemplate", ctx_r32.hourSegmentTemplate)("isTimeLabel", true)("daysInWeek", ctx_r32.daysInWeek);
  }
}
function CalendarWeekViewComponent_div_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewComponent_div_4_div_1_mwl_calendar_week_view_hour_segment_1_Template, 1, 8, "mwl-calendar-week-view-hour-segment", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const hour_r30 = ctx.$implicit;
    const odd_r31 = ctx.odd;
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-hour-odd", odd_r31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", hour_r30.segments)("ngForTrackBy", ctx_r29.trackByHourSegment);
  }
}
function CalendarWeekViewComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewComponent_div_4_div_1_Template, 2, 4, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.view.hourColumns[0].hours)("ngForTrackBy", ctx_r1.trackByHour);
  }
}
const _c26 = () => ({
  left: true,
  top: true
});
function CalendarWeekViewComponent_div_7_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 22);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c26));
  }
}
function CalendarWeekViewComponent_div_7_div_3_ng_template_3_Template(rf, ctx) {}
function CalendarWeekViewComponent_div_7_div_3_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view-event", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarWeekViewComponent_div_7_div_3_ng_template_4_Template_mwl_calendar_week_view_event_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r46);
      const timeEvent_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
      const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r44.eventClicked.emit({
        event: timeEvent_r37.event,
        sourceEvent: $event.sourceEvent
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const timeEvent_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const column_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("locale", ctx_r41.locale)("weekEvent", timeEvent_r37)("tooltipPlacement", ctx_r41.tooltipPlacement)("tooltipTemplate", ctx_r41.tooltipTemplate)("tooltipAppendToBody", ctx_r41.tooltipAppendToBody)("tooltipDisabled", ctx_r41.dragActive || ctx_r41.timeEventResizes.size > 0)("tooltipDelay", ctx_r41.tooltipDelay)("customTemplate", ctx_r41.eventTemplate)("eventTitleTemplate", ctx_r41.eventTitleTemplate)("eventActionsTemplate", ctx_r41.eventActionsTemplate)("column", column_r34)("daysInWeek", ctx_r41.daysInWeek);
  }
}
const _c27 = () => ({
  right: true,
  bottom: true
});
function CalendarWeekViewComponent_div_7_div_3_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 23);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c27));
  }
}
const _c28 = (a0, a1, a2, a3) => ({
  left: a0,
  right: a1,
  top: a2,
  bottom: a3
});
function CalendarWeekViewComponent_div_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 33, 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("resizeStart", function CalendarWeekViewComponent_div_7_div_3_Template_div_resizeStart_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const timeEvent_r37 = restoredCtx.$implicit;
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r49.timeEventResizeStarted(_r2, timeEvent_r37, $event));
    })("resizing", function CalendarWeekViewComponent_div_7_div_3_Template_div_resizing_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const timeEvent_r37 = restoredCtx.$implicit;
      const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r51.timeEventResizing(timeEvent_r37, $event));
    })("resizeEnd", function CalendarWeekViewComponent_div_7_div_3_Template_div_resizeEnd_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const timeEvent_r37 = restoredCtx.$implicit;
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r52.timeEventResizeEnded(timeEvent_r37));
    })("dragStart", function CalendarWeekViewComponent_div_7_div_3_Template_div_dragStart_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const timeEvent_r37 = restoredCtx.$implicit;
      const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r53.dragStarted(_r2, _r38, timeEvent_r37, true));
    })("dragging", function CalendarWeekViewComponent_div_7_div_3_Template_div_dragging_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const timeEvent_r37 = restoredCtx.$implicit;
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r54.dragMove(timeEvent_r37, $event));
    })("dragEnd", function CalendarWeekViewComponent_div_7_div_3_Template_div_dragEnd_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const timeEvent_r37 = restoredCtx.$implicit;
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r55.dragEnded(timeEvent_r37, $event, ctx_r55.dayColumnWidth, true));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_7_div_3_div_2_Template, 1, 2, "div", 19)(3, CalendarWeekViewComponent_div_7_div_3_ng_template_3_Template, 0, 0, "ng-template", 34)(4, CalendarWeekViewComponent_div_7_div_3_ng_template_4_Template, 1, 12, "ng-template", null, 35, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(6, CalendarWeekViewComponent_div_7_div_3_div_6_Template, 1, 2, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const timeEvent_r37 = ctx.$implicit;
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
    const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("top", timeEvent_r37.top, "px")("height", timeEvent_r37.height, "px")("left", timeEvent_r37.left, "%")("width", timeEvent_r37.width, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", timeEvent_r37.event.draggable && ctx_r35.timeEventResizes.size === 0)("cal-starts-within-day", !timeEvent_r37.startsBeforeDay)("cal-ends-within-day", !timeEvent_r37.endsAfterDay);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", timeEvent_r37.event.cssClass)("hidden", timeEvent_r37.height === 0 && timeEvent_r37.width === 0)("resizeCursors", ctx_r35.resizeCursors)("resizeSnapGrid", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction4"](30, _c28, ctx_r35.dayColumnWidth, ctx_r35.dayColumnWidth, ctx_r35.eventSnapSize || ctx_r35.hourSegmentHeight, ctx_r35.eventSnapSize || ctx_r35.hourSegmentHeight))("validateResize", ctx_r35.validateResize)("allowNegativeResizes", true)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](35, _c24, timeEvent_r37.event, ctx_r35.calendarId))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](38, _c7, timeEvent_r37.event.draggable && ctx_r35.timeEventResizes.size === 0, timeEvent_r37.event.draggable && ctx_r35.timeEventResizes.size === 0))("dragSnapGrid", ctx_r35.snapDraggedEvents ? _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](41, _c7, ctx_r35.dayColumnWidth, ctx_r35.eventSnapSize || ctx_r35.hourSegmentHeight) : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](44, _c2))("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](45, _c8))("ghostDragEnabled", !ctx_r35.snapDraggedEvents)("ghostElementTemplate", _r42)("validateDrag", ctx_r35.validateDrag);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (timeEvent_r37.event == null ? null : timeEvent_r37.event.resizable == null ? null : timeEvent_r37.event.resizable.beforeStart) && !timeEvent_r37.startsBeforeDay);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", _r42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (timeEvent_r37.event == null ? null : timeEvent_r37.event.resizable == null ? null : timeEvent_r37.event.resizable.afterEnd) && !timeEvent_r37.endsAfterDay);
  }
}
function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view-hour-segment", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template_mwl_calendar_week_view_hour_segment_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r61);
      const segment_r59 = restoredCtx.$implicit;
      const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r60.hourSegmentClicked.emit({
        date: segment_r59.date,
        sourceEvent: $event
      }));
    })("drop", function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template_mwl_calendar_week_view_hour_segment_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r61);
      const segment_r59 = restoredCtx.$implicit;
      const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r62.eventDropped($event, segment_r59.date, false));
    })("dragEnter", function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template_mwl_calendar_week_view_hour_segment_dragEnter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r61);
      const segment_r59 = restoredCtx.$implicit;
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r63.dateDragEnter(segment_r59.date));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const segment_r59 = ctx.$implicit;
    const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", ctx_r58.hourSegmentHeight, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("segment", segment_r59)("segmentHeight", ctx_r58.hourSegmentHeight)("locale", ctx_r58.locale)("customTemplate", ctx_r58.hourSegmentTemplate)("daysInWeek", ctx_r58.daysInWeek)("clickListenerDisabled", ctx_r58.hourSegmentClicked.observers.length === 0)("dragOverClass", !ctx_r58.dragActive || !ctx_r58.snapDraggedEvents ? "cal-drag-over" : null)("isTimeLabel", ctx_r58.daysInWeek === 1);
  }
}
function CalendarWeekViewComponent_div_7_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template, 1, 10, "mwl-calendar-week-view-hour-segment", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const hour_r56 = ctx.$implicit;
    const odd_r57 = ctx.odd;
    const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-hour-odd", odd_r57);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", hour_r56.segments)("ngForTrackBy", ctx_r36.trackByHourSegment);
  }
}
function CalendarWeekViewComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mwl-calendar-week-view-current-time-marker", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarWeekViewComponent_div_7_div_3_Template, 7, 46, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_7_div_4_Template, 2, 4, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r34 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("columnDate", column_r34.date)("dayStartHour", ctx_r3.dayStartHour)("dayStartMinute", ctx_r3.dayStartMinute)("dayEndHour", ctx_r3.dayEndHour)("dayEndMinute", ctx_r3.dayEndMinute)("hourSegments", ctx_r3.hourSegments)("hourDuration", ctx_r3.hourDuration)("hourSegmentHeight", ctx_r3.hourSegmentHeight)("customTemplate", ctx_r3.currentTimeMarkerTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", column_r34.events)("ngForTrackBy", ctx_r3.trackByWeekTimeEvent);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", column_r34.hours)("ngForTrackBy", ctx_r3.trackByHour);
  }
}
class ClickDirective {
  constructor(renderer, elm, document) {
    this.renderer = renderer;
    this.elm = elm;
    this.document = document;
    this.clickListenerDisabled = false;
    this.click = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter(); // eslint-disable-line
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  }
  ngOnInit() {
    if (!this.clickListenerDisabled) {
      this.listen().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe(event => {
        event.stopPropagation();
        this.click.emit(event);
      });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  listen() {
    return new rxjs__WEBPACK_IMPORTED_MODULE_5__.Observable(observer => {
      return this.renderer.listen(this.elm.nativeElement, 'click', event => {
        observer.next(event);
      });
    });
  }
}
ClickDirective.ɵfac = function ClickDirective_Factory(t) {
  return new (t || ClickDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT));
};
ClickDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: ClickDirective,
  selectors: [["", "mwlClick", ""]],
  inputs: {
    clickListenerDisabled: "clickListenerDisabled"
  },
  outputs: {
    click: "mwlClick"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](ClickDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlClick]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT]
      }]
    }];
  }, {
    clickListenerDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    click: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output,
      args: ['mwlClick']
    }]
  });
})();
class KeydownEnterDirective {
  constructor(host, ngZone, renderer) {
    this.host = host;
    this.ngZone = ngZone;
    this.renderer = renderer;
    this.keydown = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter(); // eslint-disable-line
    this.keydownListener = null;
  }
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.keydownListener = this.renderer.listen(this.host.nativeElement, 'keydown', event => {
        if (event.keyCode === 13 || event.which === 13 || event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          this.ngZone.run(() => {
            this.keydown.emit(event);
          });
        }
      });
    });
  }
  ngOnDestroy() {
    if (this.keydownListener !== null) {
      this.keydownListener();
      this.keydownListener = null;
    }
  }
}
KeydownEnterDirective.ɵfac = function KeydownEnterDirective_Factory(t) {
  return new (t || KeydownEnterDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2));
};
KeydownEnterDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: KeydownEnterDirective,
  selectors: [["", "mwlKeydownEnter", ""]],
  outputs: {
    keydown: "mwlKeydownEnter"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](KeydownEnterDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlKeydownEnter]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }];
  }, {
    keydown: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output,
      args: ['mwlKeydownEnter']
    }]
  });
})();

/**
 * This class is responsible for adding accessibility to the calendar.
 * You may override any of its methods via angulars DI to suit your requirements.
 * For example:
 *
 * ```typescript
 * import { A11yParams, CalendarA11y } from 'angular-calendar';
 * import { formatDate, I18nPluralPipe } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * // adding your own a11y params
 * export interface CustomA11yParams extends A11yParams {
 *   isDrSuess?: boolean;
 * }
 *
 * @Injectable()
 * export class CustomCalendarA11y extends CalendarA11y {
 *   constructor(protected i18nPlural: I18nPluralPipe) {
 *     super(i18nPlural);
 *   }
 *
 *   // overriding a function
 *   public openDayEventsLandmark({ date, locale, isDrSuess }: CustomA11yParams): string {
 *     if (isDrSuess) {
 *       return `
 *         ${formatDate(date, 'EEEE MMMM d', locale)}
 *          Today you are you! That is truer than true! There is no one alive
 *          who is you-er than you!
 *       `;
 *     }
 *   }
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *  provide: CalendarA11y,
 *  useClass: CustomCalendarA11y
 * }]
 * ```
 */
class CalendarA11y {
  constructor(i18nPlural) {
    this.i18nPlural = i18nPlural;
  }
  /**
   * Aria label for the badges/date of a cell
   * @example: `Saturday October 19 1 event click to expand`
   */
  monthCell({
    day,
    locale
  }) {
    if (day.badgeTotal > 0) {
      return `
        ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(day.date, 'EEEE MMMM d', locale)},
        ${this.i18nPlural.transform(day.badgeTotal, {
        '=0': 'No events',
        '=1': 'One event',
        other: '# events'
      })},
         click to expand
      `;
    } else {
      return `${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(day.date, 'EEEE MMMM d', locale)}`;
    }
  }
  /**
   * Aria label for the open day events start landmark
   * @example: `Saturday October 19 expanded view`
   */
  openDayEventsLandmark({
    date,
    locale
  }) {
    return `
      Beginning of expanded view for ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE MMMM dd', locale)}
    `;
  }
  /**
   * Aria label for alert that a day in the month view was expanded
   * @example: `Saturday October 19 expanded`
   */
  openDayEventsAlert({
    date,
    locale
  }) {
    return `${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE MMMM dd', locale)} expanded`;
  }
  /**
   * Descriptive aria label for an event
   * @example: `Saturday October 19th, Scott's Pizza Party, from 11:00am to 5:00pm`
   */
  eventDescription({
    event,
    locale
  }) {
    if (event.allDay === true) {
      return this.allDayEventDescription({
        event,
        locale
      });
    }
    const aria = `
      ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.start, 'EEEE MMMM dd', locale)},
      ${event.title}, from ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.start, 'hh:mm a', locale)}
    `;
    if (event.end) {
      return aria + ` to ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.end, 'hh:mm a', locale)}`;
    }
    return aria;
  }
  /**
   * Descriptive aria label for an all day event
   * @example:
   * `Scott's Party, event spans multiple days: start time October 19 5:00pm, no stop time`
   */
  allDayEventDescription({
    event,
    locale
  }) {
    const aria = `
      ${event.title}, event spans multiple days:
      start time ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.start, 'MMMM dd hh:mm a', locale)}
    `;
    if (event.end) {
      return aria + `, stop time ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.end, 'MMMM d hh:mm a', locale)}`;
    }
    return aria + `, no stop time`;
  }
  /**
   * Aria label for the calendar event actions icons
   * @returns 'Edit' for fa-pencil icons, and 'Delete' for fa-times icons
   */
  actionButtonLabel({
    action
  }) {
    return action.a11yLabel;
  }
  /**
   * @returns {number} Tab index to be given to month cells
   */
  monthCellTabIndex() {
    return 0;
  }
  /**
   * @returns true if the events inside the month cell should be aria-hidden
   */
  hideMonthCellEvents() {
    return true;
  }
  /**
   * @returns true if event titles should be aria-hidden (global)
   */
  hideEventTitle() {
    return true;
  }
  /**
   * @returns true if hour segments in the week view should be aria-hidden
   */
  hideWeekHourSegment() {
    return true;
  }
  /**
   * @returns true if hour segments in the day view should be aria-hidden
   */
  hideDayHourSegment() {
    return true;
  }
}
CalendarA11y.ɵfac = function CalendarA11y_Factory(t) {
  return new (t || CalendarA11y)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe));
};
CalendarA11y.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarA11y,
  factory: CalendarA11y.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarA11y, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: _angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe
    }];
  }, null);
})();

/**
 * This pipe is primarily for rendering aria labels. Example usage:
 * ```typescript
 * // where `myEvent` is a `CalendarEvent` and myLocale is a locale identifier
 * {{ { event: myEvent, locale: myLocale } | calendarA11y: 'eventDescription' }}
 * ```
 */
class CalendarA11yPipe {
  constructor(calendarA11y, locale) {
    this.calendarA11y = calendarA11y;
    this.locale = locale;
  }
  transform(a11yParams, method) {
    a11yParams.locale = a11yParams.locale || this.locale;
    if (typeof this.calendarA11y[method] === 'undefined') {
      const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarA11y.prototype)).filter(iMethod => iMethod !== 'constructor');
      throw new Error(`${method} is not a valid a11y method. Can only be one of ${allowedMethods.join(', ')}`);
    }
    return this.calendarA11y[method](a11yParams);
  }
}
CalendarA11yPipe.ɵfac = function CalendarA11yPipe_Factory(t) {
  return new (t || CalendarA11yPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarA11y, 16), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID, 16));
};
CalendarA11yPipe.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
  name: "calendarA11y",
  type: CalendarA11yPipe,
  pure: true
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarA11yPipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Pipe,
    args: [{
      name: 'calendarA11y'
    }]
  }], function () {
    return [{
      type: CalendarA11y
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }];
  }, null);
})();
class CalendarEventActionsComponent {
  constructor() {
    this.trackByActionId = (index, action) => action.id ? action.id : action;
  }
}
CalendarEventActionsComponent.ɵfac = function CalendarEventActionsComponent_Factory(t) {
  return new (t || CalendarEventActionsComponent)();
};
CalendarEventActionsComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarEventActionsComponent,
  selectors: [["mwl-calendar-event-actions"]],
  inputs: {
    event: "event",
    customTemplate: "customTemplate"
  },
  decls: 3,
  vars: 5,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "cal-event-actions", 4, "ngIf"], [1, "cal-event-actions"], ["class", "cal-event-action", "href", "javascript:;", "tabindex", "0", "role", "button", 3, "ngClass", "innerHtml", "mwlClick", "mwlKeydownEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["href", "javascript:;", "tabindex", "0", "role", "button", 1, "cal-event-action", 3, "ngClass", "innerHtml", "mwlClick", "mwlKeydownEnter"]],
  template: function CalendarEventActionsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarEventActionsComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarEventActionsComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c1, ctx.event, ctx.trackByActionId));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, ClickDirective, KeydownEnterDirective, CalendarA11yPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarEventActionsComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-event-actions',
      template: `
    <ng-template
      #defaultTemplate
      let-event="event"
      let-trackByActionId="trackByActionId"
    >
      <span *ngIf="event.actions" class="cal-event-actions">
        <a
          class="cal-event-action"
          href="javascript:;"
          *ngFor="let action of event.actions; trackBy: trackByActionId"
          (mwlClick)="action.onClick({ event: event, sourceEvent: $event })"
          (mwlKeydownEnter)="
            action.onClick({ event: event, sourceEvent: $event })
          "
          [ngClass]="action.cssClass"
          [innerHtml]="action.label"
          tabindex="0"
          role="button"
          [attr.aria-label]="
            { action: action } | calendarA11y : 'actionButtonLabel'
          "
        >
        </a>
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        trackByActionId: trackByActionId
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();

/**
 * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
 *
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
 *
 * @Injectable()
 * class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
 *
 *   month(event: CalendarEvent): string {
 *     return `Custom prefix: ${event.title}`;
 *   }
 *
 * }
 *
 * // in your component
 * providers: [{
 *  provide: CalendarEventTitleFormatter,
 *  useClass: CustomEventTitleFormatter
 * }]
 * ```
 */
class CalendarEventTitleFormatter {
  /**
   * The month view event title.
   */
  month(event, title) {
    return event.title;
  }
  /**
   * The month view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  monthTooltip(event, title) {
    return event.title;
  }
  /**
   * The week view event title.
   */
  week(event, title) {
    return event.title;
  }
  /**
   * The week view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  weekTooltip(event, title) {
    return event.title;
  }
  /**
   * The day view event title.
   */
  day(event, title) {
    return event.title;
  }
  /**
   * The day view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  dayTooltip(event, title) {
    return event.title;
  }
}
class CalendarEventTitlePipe {
  constructor(calendarEventTitle) {
    this.calendarEventTitle = calendarEventTitle;
  }
  transform(title, titleType, event) {
    return this.calendarEventTitle[titleType](event, title);
  }
}
CalendarEventTitlePipe.ɵfac = function CalendarEventTitlePipe_Factory(t) {
  return new (t || CalendarEventTitlePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarEventTitleFormatter, 16));
};
CalendarEventTitlePipe.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
  name: "calendarEventTitle",
  type: CalendarEventTitlePipe,
  pure: true
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarEventTitlePipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Pipe,
    args: [{
      name: 'calendarEventTitle'
    }]
  }], function () {
    return [{
      type: CalendarEventTitleFormatter
    }];
  }, null);
})();
class CalendarEventTitleComponent {}
CalendarEventTitleComponent.ɵfac = function CalendarEventTitleComponent_Factory(t) {
  return new (t || CalendarEventTitleComponent)();
};
CalendarEventTitleComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarEventTitleComponent,
  selectors: [["mwl-calendar-event-title"]],
  inputs: {
    event: "event",
    customTemplate: "customTemplate",
    view: "view"
  },
  decls: 3,
  vars: 5,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-event-title", 3, "innerHTML"]],
  template: function CalendarEventTitleComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarEventTitleComponent_ng_template_0_Template, 3, 10, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarEventTitleComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c3, ctx.event, ctx.view));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, CalendarEventTitlePipe, CalendarA11yPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarEventTitleComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-event-title',
      template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle : view : event"
        [attr.aria-hidden]="{} | calendarA11y : 'hideEventTitle'"
      >
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    view: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();
class CalendarTooltipWindowComponent {}
CalendarTooltipWindowComponent.ɵfac = function CalendarTooltipWindowComponent_Factory(t) {
  return new (t || CalendarTooltipWindowComponent)();
};
CalendarTooltipWindowComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarTooltipWindowComponent,
  selectors: [["mwl-calendar-tooltip-window"]],
  inputs: {
    contents: "contents",
    placement: "placement",
    event: "event",
    customTemplate: "customTemplate"
  },
  decls: 3,
  vars: 6,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-tooltip", 3, "ngClass"], [1, "cal-tooltip-arrow"], [1, "cal-tooltip-inner", 3, "innerHtml"]],
  template: function CalendarTooltipWindowComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarTooltipWindowComponent_ng_template_0_Template, 3, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarTooltipWindowComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](2, _c4, ctx.contents, ctx.placement, ctx.event));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarTooltipWindowComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-tooltip-window',
      template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event"
    >
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    contents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    placement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();
class CalendarTooltipDirective {
  constructor(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document // eslint-disable-line
  ) {
    this.elementRef = elementRef;
    this.injector = injector;
    this.renderer = renderer;
    this.viewContainerRef = viewContainerRef;
    this.document = document;
    this.placement = 'auto'; // eslint-disable-line  @angular-eslint/no-input-rename
    this.delay = null; // eslint-disable-line  @angular-eslint/no-input-rename
    this.cancelTooltipDelay$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
    this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
  }
  ngOnChanges(changes) {
    if (this.tooltipRef && (changes.contents || changes.customTemplate || changes.event)) {
      this.tooltipRef.instance.contents = this.contents;
      this.tooltipRef.instance.customTemplate = this.customTemplate;
      this.tooltipRef.instance.event = this.event;
      this.tooltipRef.changeDetectorRef.markForCheck();
      if (!this.contents) {
        this.hide();
      }
    }
  }
  ngOnDestroy() {
    this.hide();
  }
  onMouseOver() {
    const delay$ = this.delay === null ? (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)('now') : (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.timer)(this.delay);
    delay$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.cancelTooltipDelay$)).subscribe(() => {
      this.show();
    });
  }
  onMouseOut() {
    this.hide();
  }
  show() {
    if (!this.tooltipRef && this.contents) {
      this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
      this.tooltipRef.instance.contents = this.contents;
      this.tooltipRef.instance.customTemplate = this.customTemplate;
      this.tooltipRef.instance.event = this.event;
      if (this.appendToBody) {
        this.document.body.appendChild(this.tooltipRef.location.nativeElement);
      }
      requestAnimationFrame(() => {
        this.positionTooltip();
      });
    }
  }
  hide() {
    if (this.tooltipRef) {
      this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
      this.tooltipRef = null;
    }
    this.cancelTooltipDelay$.next();
  }
  positionTooltip(previousPositions = []) {
    if (this.tooltipRef) {
      this.tooltipRef.changeDetectorRef.detectChanges();
      this.tooltipRef.instance.placement = (0,positioning__WEBPACK_IMPORTED_MODULE_0__.positionElements)(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
      // keep re-positioning the tooltip until the arrow position doesn't make a difference
      if (previousPositions.indexOf(this.tooltipRef.instance.placement) === -1) {
        this.positionTooltip([...previousPositions, this.tooltipRef.instance.placement]);
      }
    }
  }
}
CalendarTooltipDirective.ɵfac = function CalendarTooltipDirective_Factory(t) {
  return new (t || CalendarTooltipDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Injector), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ComponentFactoryResolver), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT));
};
CalendarTooltipDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarTooltipDirective,
  selectors: [["", "mwlCalendarTooltip", ""]],
  hostBindings: function CalendarTooltipDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mouseenter", function CalendarTooltipDirective_mouseenter_HostBindingHandler() {
        return ctx.onMouseOver();
      })("mouseleave", function CalendarTooltipDirective_mouseleave_HostBindingHandler() {
        return ctx.onMouseOut();
      });
    }
  },
  inputs: {
    contents: ["mwlCalendarTooltip", "contents"],
    placement: ["tooltipPlacement", "placement"],
    customTemplate: ["tooltipTemplate", "customTemplate"],
    event: ["tooltipEvent", "event"],
    appendToBody: ["tooltipAppendToBody", "appendToBody"],
    delay: ["tooltipDelay", "delay"]
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarTooltipDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarTooltip]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injector
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ComponentFactoryResolver
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT]
      }]
    }];
  }, {
    contents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['mwlCalendarTooltip']
    }],
    placement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipPlacement']
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipTemplate']
    }],
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipEvent']
    }],
    appendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipAppendToBody']
    }],
    delay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipDelay']
    }],
    onMouseOver: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['mouseenter']
    }],
    onMouseOut: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['mouseleave']
    }]
  });
})();
var CalendarView;
(function (CalendarView) {
  CalendarView["Month"] = "month";
  CalendarView["Week"] = "week";
  CalendarView["Day"] = "day";
})(CalendarView || (CalendarView = {}));
const validateEvents = events => {
  const warn = (...args) => console.warn('angular-calendar', ...args);
  return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.validateEvents)(events, warn);
};
function isInsideLeftAndRight(outer, inner) {
  return Math.floor(outer.left) <= Math.ceil(inner.left) && Math.floor(inner.left) <= Math.ceil(outer.right) && Math.floor(outer.left) <= Math.ceil(inner.right) && Math.floor(inner.right) <= Math.ceil(outer.right);
}
function isInsideTopAndBottom(outer, inner) {
  return Math.floor(outer.top) <= Math.ceil(inner.top) && Math.floor(inner.top) <= Math.ceil(outer.bottom) && Math.floor(outer.top) <= Math.ceil(inner.bottom) && Math.floor(inner.bottom) <= Math.ceil(outer.bottom);
}
function isInside(outer, inner) {
  return isInsideLeftAndRight(outer, inner) && isInsideTopAndBottom(outer, inner);
}
function roundToNearest(amount, precision) {
  return Math.round(amount / precision) * precision;
}
const trackByEventId = (index, event) => event.id ? event.id : event;
const trackByWeekDayHeaderDate = (index, day) => day.date.toISOString();
const trackByHourSegment = (index, segment) => segment.date.toISOString();
const trackByHour = (index, hour) => hour.segments[0].date.toISOString();
const trackByWeekAllDayEvent = (index, weekEvent) => weekEvent.event.id ? weekEvent.event.id : weekEvent.event;
const trackByWeekTimeEvent = (index, weekEvent) => weekEvent.event.id ? weekEvent.event.id : weekEvent.event;
const MINUTES_IN_HOUR = 60;
function getPixelAmountInMinutes(hourSegments, hourSegmentHeight, hourDuration) {
  return (hourDuration || MINUTES_IN_HOUR) / (hourSegments * hourSegmentHeight);
}
function getMinutesMoved(movedY, hourSegments, hourSegmentHeight, eventSnapSize, hourDuration) {
  const draggedInPixelsSnapSize = roundToNearest(movedY, eventSnapSize || hourSegmentHeight);
  const pixelAmountInMinutes = getPixelAmountInMinutes(hourSegments, hourSegmentHeight, hourDuration);
  return draggedInPixelsSnapSize * pixelAmountInMinutes;
}
function getDefaultEventEnd(dateAdapter, event, minimumMinutes) {
  if (event.end) {
    return event.end;
  } else {
    return dateAdapter.addMinutes(event.start, minimumMinutes);
  }
}
function addDaysWithExclusions(dateAdapter, date, days, excluded) {
  let daysCounter = 0;
  let daysToAdd = 0;
  const changeDays = days < 0 ? dateAdapter.subDays : dateAdapter.addDays;
  let result = date;
  while (daysToAdd <= Math.abs(days)) {
    result = changeDays(date, daysCounter);
    const day = dateAdapter.getDay(result);
    if (excluded.indexOf(day) === -1) {
      daysToAdd++;
    }
    daysCounter++;
  }
  return result;
}
function isDraggedWithinPeriod(newStart, newEnd, period) {
  const end = newEnd || newStart;
  return period.start <= newStart && newStart <= period.end || period.start <= end && end <= period.end;
}
function shouldFireDroppedEvent(dropEvent, date, allDay, calendarId) {
  return dropEvent.dropData && dropEvent.dropData.event && (dropEvent.dropData.calendarId !== calendarId || dropEvent.dropData.event.allDay && !allDay || !dropEvent.dropData.event.allDay && allDay);
}
function getWeekViewPeriod(dateAdapter, viewDate, weekStartsOn, excluded = [], daysInWeek) {
  let viewStart = daysInWeek ? dateAdapter.startOfDay(viewDate) : dateAdapter.startOfWeek(viewDate, {
    weekStartsOn
  });
  const endOfWeek = dateAdapter.endOfWeek(viewDate, {
    weekStartsOn
  });
  while (excluded.indexOf(dateAdapter.getDay(viewStart)) > -1 && viewStart < endOfWeek) {
    viewStart = dateAdapter.addDays(viewStart, 1);
  }
  if (daysInWeek) {
    const viewEnd = dateAdapter.endOfDay(addDaysWithExclusions(dateAdapter, viewStart, daysInWeek - 1, excluded));
    return {
      viewStart,
      viewEnd
    };
  } else {
    let viewEnd = endOfWeek;
    while (excluded.indexOf(dateAdapter.getDay(viewEnd)) > -1 && viewEnd > viewStart) {
      viewEnd = dateAdapter.subDays(viewEnd, 1);
    }
    return {
      viewStart,
      viewEnd
    };
  }
}
function isWithinThreshold({
  x,
  y
}) {
  const DRAG_THRESHOLD = 1;
  return Math.abs(x) > DRAG_THRESHOLD || Math.abs(y) > DRAG_THRESHOLD;
}
class DateAdapter {}

/**
 * Change the view date to the previous view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarPreviousView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Previous
 * </button>
 * ```
 */
class CalendarPreviousViewDirective {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
    /**
     * Days to skip when going back by 1 day
     */
    this.excludeDays = [];
    /**
     * Called when the view date is changed
     */
    this.viewDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * @hidden
   */
  onClick() {
    const subFn = {
      day: this.dateAdapter.subDays,
      week: this.dateAdapter.subWeeks,
      month: this.dateAdapter.subMonths
    }[this.view];
    if (this.view === CalendarView.Day) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -1, this.excludeDays));
    } else if (this.view === CalendarView.Week && this.daysInWeek) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -this.daysInWeek, this.excludeDays));
    } else {
      this.viewDateChange.emit(subFn(this.viewDate, 1));
    }
  }
}
CalendarPreviousViewDirective.ɵfac = function CalendarPreviousViewDirective_Factory(t) {
  return new (t || CalendarPreviousViewDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarPreviousViewDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarPreviousViewDirective,
  selectors: [["", "mwlCalendarPreviousView", ""]],
  hostBindings: function CalendarPreviousViewDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarPreviousViewDirective_click_HostBindingHandler() {
        return ctx.onClick();
      });
    }
  },
  inputs: {
    view: "view",
    viewDate: "viewDate",
    excludeDays: "excludeDays",
    daysInWeek: "daysInWeek"
  },
  outputs: {
    viewDateChange: "viewDateChange"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarPreviousViewDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarPreviousView]'
    }]
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, {
    view: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDateChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    onClick: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['click']
    }]
  });
})();

/**
 * Change the view date to the next view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarNextView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Next
 * </button>
 * ```
 */
class CalendarNextViewDirective {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
    /**
     * Days to skip when going forward by 1 day
     */
    this.excludeDays = [];
    /**
     * Called when the view date is changed
     */
    this.viewDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * @hidden
   */
  onClick() {
    const addFn = {
      day: this.dateAdapter.addDays,
      week: this.dateAdapter.addWeeks,
      month: this.dateAdapter.addMonths
    }[this.view];
    if (this.view === CalendarView.Day) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, 1, this.excludeDays));
    } else if (this.view === CalendarView.Week && this.daysInWeek) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, this.daysInWeek, this.excludeDays));
    } else {
      this.viewDateChange.emit(addFn(this.viewDate, 1));
    }
  }
}
CalendarNextViewDirective.ɵfac = function CalendarNextViewDirective_Factory(t) {
  return new (t || CalendarNextViewDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarNextViewDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarNextViewDirective,
  selectors: [["", "mwlCalendarNextView", ""]],
  hostBindings: function CalendarNextViewDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarNextViewDirective_click_HostBindingHandler() {
        return ctx.onClick();
      });
    }
  },
  inputs: {
    view: "view",
    viewDate: "viewDate",
    excludeDays: "excludeDays",
    daysInWeek: "daysInWeek"
  },
  outputs: {
    viewDateChange: "viewDateChange"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarNextViewDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarNextView]'
    }]
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, {
    view: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDateChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    onClick: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['click']
    }]
  });
})();

/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
class CalendarTodayDirective {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
    /**
     * Called when the view date is changed
     */
    this.viewDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * @hidden
   */
  onClick() {
    this.viewDateChange.emit(this.dateAdapter.startOfDay(new Date()));
  }
}
CalendarTodayDirective.ɵfac = function CalendarTodayDirective_Factory(t) {
  return new (t || CalendarTodayDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarTodayDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarTodayDirective,
  selectors: [["", "mwlCalendarToday", ""]],
  hostBindings: function CalendarTodayDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarTodayDirective_click_HostBindingHandler() {
        return ctx.onClick();
      });
    }
  },
  inputs: {
    viewDate: "viewDate"
  },
  outputs: {
    viewDateChange: "viewDateChange"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarTodayDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarToday]'
    }]
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDateChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    onClick: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['click']
    }]
  });
})();

/**
 * This will use the angular date pipe to do all date formatting. It is the default date formatter used by the calendar.
 */
class CalendarAngularDateFormatter {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
  }
  /**
   * The month view header week day labels
   */
  monthViewColumnHeader({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE', locale);
  }
  /**
   * The month view cell day number
   */
  monthViewDayNumber({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'd', locale);
  }
  /**
   * The month view title
   */
  monthViewTitle({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'LLLL y', locale);
  }
  /**
   * The week view header week day labels
   */
  weekViewColumnHeader({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE', locale);
  }
  /**
   * The week view sub header day and month labels
   */
  weekViewColumnSubHeader({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'MMM d', locale);
  }
  /**
   * The week view title
   */
  weekViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }) {
    const {
      viewStart,
      viewEnd
    } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat, showYear) => (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(dateToFormat, 'MMM d' + (showYear ? ', yyyy' : ''), locale);
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }
  /**
   * The time formatting down the left hand side of the week view
   */
  weekViewHour({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'h a', locale);
  }
  /**
   * The time formatting down the left hand side of the day view
   */
  dayViewHour({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'h a', locale);
  }
  /**
   * The day view title
   */
  dayViewTitle({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE, MMMM d, y', locale);
  }
}
CalendarAngularDateFormatter.ɵfac = function CalendarAngularDateFormatter_Factory(t) {
  return new (t || CalendarAngularDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarAngularDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarAngularDateFormatter,
  factory: CalendarAngularDateFormatter.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarAngularDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, null);
})();

/**
 * This class is responsible for all formatting of dates. There are 3 implementations available, the `CalendarAngularDateFormatter` (default) which uses the angular date pipe to format dates, the `CalendarNativeDateFormatter` which will use the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to format dates, or there is the `CalendarMomentDateFormatter` which uses <a href="http://momentjs.com/" target="_blank">moment</a>.
 *
 * If you wish, you may override any of the defaults via angulars DI. For example:
 *
 * ```typescript
 * import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
 * import { formatDate } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * @Injectable()
 * class CustomDateFormatter extends CalendarDateFormatter {
 *
 *   public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
 *     return formatDate(date, 'EEE', locale); // use short week days
 *   }
 *
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *   provide: CalendarDateFormatter,
 *   useClass: CustomDateFormatter
 * }]
 * ```
 */
class CalendarDateFormatter extends CalendarAngularDateFormatter {}
CalendarDateFormatter.ɵfac = /* @__PURE__ */(() => {
  let ɵCalendarDateFormatter_BaseFactory;
  return function CalendarDateFormatter_Factory(t) {
    return (ɵCalendarDateFormatter_BaseFactory || (ɵCalendarDateFormatter_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetInheritedFactory"](CalendarDateFormatter)))(t || CalendarDateFormatter);
  };
})();
CalendarDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarDateFormatter,
  factory: CalendarDateFormatter.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], null, null);
})();

/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
class CalendarDatePipe {
  constructor(dateFormatter, locale) {
    this.dateFormatter = dateFormatter;
    this.locale = locale;
  }
  transform(date, method, locale = this.locale, weekStartsOn = 0, excludeDays = [], daysInWeek) {
    if (typeof this.dateFormatter[method] === 'undefined') {
      const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarDateFormatter.prototype)).filter(iMethod => iMethod !== 'constructor');
      throw new Error(`${method} is not a valid date formatter. Can only be one of ${allowedMethods.join(', ')}`);
    }
    return this.dateFormatter[method]({
      date,
      locale,
      weekStartsOn,
      excludeDays,
      daysInWeek
    });
  }
}
CalendarDatePipe.ɵfac = function CalendarDatePipe_Factory(t) {
  return new (t || CalendarDatePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarDateFormatter, 16), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID, 16));
};
CalendarDatePipe.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
  name: "calendarDate",
  type: CalendarDatePipe,
  pure: true
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDatePipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Pipe,
    args: [{
      name: 'calendarDate'
    }]
  }], function () {
    return [{
      type: CalendarDateFormatter
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }];
  }, null);
})();
class CalendarUtils {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
  }
  getMonthView(args) {
    return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.getMonthView)(this.dateAdapter, args);
  }
  getWeekViewHeader(args) {
    return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.getWeekViewHeader)(this.dateAdapter, args);
  }
  getWeekView(args) {
    return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.getWeekView)(this.dateAdapter, args);
  }
}
CalendarUtils.ɵfac = function CalendarUtils_Factory(t) {
  return new (t || CalendarUtils)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarUtils.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarUtils,
  factory: CalendarUtils.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarUtils, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, null);
})();
const MOMENT = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.InjectionToken('Moment');
/**
 * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
 *
 * ```typescript
 * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
 * import moment from 'moment';
 *
 * // in your component
 * provide: [{
 *   provide: MOMENT, useValue: moment
 * }, {
 *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
 * }]
 *
 * ```
 */
class CalendarMomentDateFormatter {
  /**
   * @hidden
   */
  constructor(moment, dateAdapter) {
    this.moment = moment;
    this.dateAdapter = dateAdapter;
  }
  /**
   * The month view header week day labels
   */
  monthViewColumnHeader({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('dddd');
  }
  /**
   * The month view cell day number
   */
  monthViewDayNumber({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('D');
  }
  /**
   * The month view title
   */
  monthViewTitle({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('MMMM YYYY');
  }
  /**
   * The week view header week day labels
   */
  weekViewColumnHeader({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('dddd');
  }
  /**
   * The week view sub header day and month labels
   */
  weekViewColumnSubHeader({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('MMM D');
  }
  /**
   * The week view title
   */
  weekViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }) {
    const {
      viewStart,
      viewEnd
    } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat, showYear) => this.moment(dateToFormat).locale(locale).format('MMM D' + (showYear ? ', YYYY' : ''));
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }
  /**
   * The time formatting down the left hand side of the week view
   */
  weekViewHour({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('ha');
  }
  /**
   * The time formatting down the left hand side of the day view
   */
  dayViewHour({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('ha');
  }
  /**
   * The day view title
   */
  dayViewTitle({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('dddd, LL'); // dddd = Thursday
  } // LL = locale-dependent Month Day, Year
}

CalendarMomentDateFormatter.ɵfac = function CalendarMomentDateFormatter_Factory(t) {
  return new (t || CalendarMomentDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](MOMENT), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarMomentDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarMomentDateFormatter,
  factory: CalendarMomentDateFormatter.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMomentDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [MOMENT]
      }]
    }, {
      type: DateAdapter
    }];
  }, null);
})();

/**
 * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting.
 *
 * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
 */
class CalendarNativeDateFormatter {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
  }
  /**
   * The month view header week day labels
   */
  monthViewColumnHeader({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long'
    }).format(date);
  }
  /**
   * The month view cell day number
   */
  monthViewDayNumber({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric'
    }).format(date);
  }
  /**
   * The month view title
   */
  monthViewTitle({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long'
    }).format(date);
  }
  /**
   * The week view header week day labels
   */
  weekViewColumnHeader({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long'
    }).format(date);
  }
  /**
   * The week view sub header day and month labels
   */
  weekViewColumnSubHeader({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short'
    }).format(date);
  }
  /**
   * The week view title
   */
  weekViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }) {
    const {
      viewStart,
      viewEnd
    } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat, showYear) => new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: showYear ? 'numeric' : undefined
    }).format(dateToFormat);
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }
  /**
   * The time formatting down the left hand side of the week view
   */
  weekViewHour({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
    }).format(date);
  }
  /**
   * The time formatting down the left hand side of the day view
   */
  dayViewHour({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
    }).format(date);
  }
  /**
   * The day view title
   */
  dayViewTitle({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }).format(date);
  }
}
CalendarNativeDateFormatter.ɵfac = function CalendarNativeDateFormatter_Factory(t) {
  return new (t || CalendarNativeDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarNativeDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarNativeDateFormatter,
  factory: CalendarNativeDateFormatter.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarNativeDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, null);
})();
var CalendarEventTimesChangedEventType;
(function (CalendarEventTimesChangedEventType) {
  CalendarEventTimesChangedEventType["Drag"] = "drag";
  CalendarEventTimesChangedEventType["Drop"] = "drop";
  CalendarEventTimesChangedEventType["Resize"] = "resize";
})(CalendarEventTimesChangedEventType || (CalendarEventTimesChangedEventType = {}));

/**
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
class CalendarCommonModule {
  static forRoot(dateAdapter, config = {}) {
    return {
      ngModule: CalendarCommonModule,
      providers: [dateAdapter, config.eventTitleFormatter || CalendarEventTitleFormatter, config.dateFormatter || CalendarDateFormatter, config.utils || CalendarUtils, config.a11y || CalendarA11y]
    };
  }
}
CalendarCommonModule.ɵfac = function CalendarCommonModule_Factory(t) {
  return new (t || CalendarCommonModule)();
};
CalendarCommonModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarCommonModule
});
CalendarCommonModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  providers: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe],
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarCommonModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      declarations: [CalendarEventActionsComponent, CalendarEventTitleComponent, CalendarTooltipWindowComponent, CalendarTooltipDirective, CalendarPreviousViewDirective, CalendarNextViewDirective, CalendarTodayDirective, CalendarDatePipe, CalendarEventTitlePipe, CalendarA11yPipe, ClickDirective, KeydownEnterDirective],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule],
      exports: [CalendarEventActionsComponent, CalendarEventTitleComponent, CalendarTooltipWindowComponent, CalendarTooltipDirective, CalendarPreviousViewDirective, CalendarNextViewDirective, CalendarTodayDirective, CalendarDatePipe, CalendarEventTitlePipe, CalendarA11yPipe, ClickDirective, KeydownEnterDirective],
      providers: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe]
    }]
  }], null, null);
})();
class CalendarMonthCellComponent {
  constructor() {
    this.highlightDay = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.unhighlightDay = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByEventId = trackByEventId;
    this.validateDrag = isWithinThreshold;
  }
}
CalendarMonthCellComponent.ɵfac = function CalendarMonthCellComponent_Factory(t) {
  return new (t || CalendarMonthCellComponent)();
};
CalendarMonthCellComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarMonthCellComponent,
  selectors: [["mwl-calendar-month-cell"]],
  hostAttrs: [1, "cal-cell", "cal-day-cell"],
  hostVars: 18,
  hostBindings: function CalendarMonthCellComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-past", ctx.day.isPast)("cal-today", ctx.day.isToday)("cal-future", ctx.day.isFuture)("cal-weekend", ctx.day.isWeekend)("cal-in-month", ctx.day.inMonth)("cal-out-month", !ctx.day.inMonth)("cal-has-events", ctx.day.events.length > 0)("cal-open", ctx.day === ctx.openDay)("cal-event-highlight", !!ctx.day.backgroundColor);
    }
  },
  inputs: {
    day: "day",
    openDay: "openDay",
    locale: "locale",
    tooltipPlacement: "tooltipPlacement",
    tooltipAppendToBody: "tooltipAppendToBody",
    customTemplate: "customTemplate",
    tooltipTemplate: "tooltipTemplate",
    tooltipDelay: "tooltipDelay"
  },
  outputs: {
    highlightDay: "highlightDay",
    unhighlightDay: "unhighlightDay",
    eventClicked: "eventClicked"
  },
  decls: 3,
  vars: 15,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-cell-top"], ["aria-hidden", "true"], ["class", "cal-day-badge", 4, "ngIf"], [1, "cal-day-number"], ["class", "cal-events", 4, "ngIf"], [1, "cal-day-badge"], [1, "cal-events"], ["class", "cal-event", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "ngStyle", "ngClass", "mwlCalendarTooltip", "tooltipPlacement", "tooltipEvent", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "cal-draggable", "dropData", "dragAxis", "validateDrag", "touchStartLongPress", "mouseenter", "mouseleave", "mwlClick", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDraggable", "", "dragActiveClass", "cal-drag-active", 1, "cal-event", 3, "ngStyle", "ngClass", "mwlCalendarTooltip", "tooltipPlacement", "tooltipEvent", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "dropData", "dragAxis", "validateDrag", "touchStartLongPress", "mouseenter", "mouseleave", "mwlClick"]],
  template: function CalendarMonthCellComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarMonthCellComponent_ng_template_0_Template, 8, 14, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarMonthCellComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunctionV"](2, _c10, [ctx.day, ctx.openDay, ctx.locale, ctx.tooltipPlacement, ctx.highlightDay, ctx.unhighlightDay, ctx.eventClicked, ctx.tooltipTemplate, ctx.tooltipAppendToBody, ctx.tooltipDelay, ctx.trackByEventId, ctx.validateDrag]));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DraggableDirective, CalendarTooltipDirective, ClickDirective, CalendarDatePipe, CalendarEventTitlePipe, CalendarA11yPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthCellComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-month-cell',
      template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDelay="tooltipDelay"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-cell-top"
        [attr.aria-label]="
          { day: day, locale: locale } | calendarA11y : 'monthCell'
        "
      >
        <span aria-hidden="true">
          <span class="cal-day-badge" *ngIf="day.badgeTotal > 0">{{
            day.badgeTotal
          }}</span>
          <span class="cal-day-number">{{
            day.date | calendarDate : 'monthViewDayNumber' : locale
          }}</span>
        </span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy: trackByEventId"
          [ngStyle]="{ backgroundColor: event.color?.primary }"
          [ngClass]="event?.cssClass"
          (mouseenter)="highlightDay.emit({ event: event })"
          (mouseleave)="unhighlightDay.emit({ event: event })"
          [mwlCalendarTooltip]="
            event.title | calendarEventTitle : 'monthTooltip' : event
          "
          [tooltipPlacement]="tooltipPlacement"
          [tooltipEvent]="event"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipAppendToBody]="tooltipAppendToBody"
          [tooltipDelay]="tooltipDelay"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event, draggedFrom: day }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
          (mwlClick)="eventClicked.emit({ event: event, sourceEvent: $event })"
          [attr.aria-hidden]="{} | calendarA11y : 'hideMonthCellEvents'"
        ></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDelay: tooltipDelay,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
      // eslint-disable-next-line @angular-eslint/no-host-metadata-property
      host: {
        class: 'cal-cell cal-day-cell',
        '[class.cal-past]': 'day.isPast',
        '[class.cal-today]': 'day.isToday',
        '[class.cal-future]': 'day.isFuture',
        '[class.cal-weekend]': 'day.isWeekend',
        '[class.cal-in-month]': 'day.inMonth',
        '[class.cal-out-month]': '!day.inMonth',
        '[class.cal-has-events]': 'day.events.length > 0',
        '[class.cal-open]': 'day === openDay',
        '[class.cal-event-highlight]': '!!day.backgroundColor'
      }
    }]
  }], null, {
    day: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    openDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    highlightDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    unhighlightDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
const collapseAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.trigger)('collapse', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.state)('void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.style)({
  height: 0,
  overflow: 'hidden',
  'padding-top': 0,
  'padding-bottom': 0
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.state)('*', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.style)({
  height: '*',
  overflow: 'hidden',
  'padding-top': '*',
  'padding-bottom': '*'
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.transition)('* => void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.animate)('150ms ease-out')), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.transition)('void => *', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.animate)('150ms ease-in'))]);
class CalendarOpenDayEventsComponent {
  constructor() {
    this.isOpen = false;
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByEventId = trackByEventId;
    this.validateDrag = isWithinThreshold;
  }
}
CalendarOpenDayEventsComponent.ɵfac = function CalendarOpenDayEventsComponent_Factory(t) {
  return new (t || CalendarOpenDayEventsComponent)();
};
CalendarOpenDayEventsComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarOpenDayEventsComponent,
  selectors: [["mwl-calendar-open-day-events"]],
  inputs: {
    locale: "locale",
    isOpen: "isOpen",
    events: "events",
    customTemplate: "customTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    date: "date"
  },
  outputs: {
    eventClicked: "eventClicked"
  },
  decls: 3,
  vars: 8,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "cal-open-day-events", "role", "application", 4, "ngIf"], ["role", "application", 1, "cal-open-day-events"], ["tabindex", "-1", "role", "alert"], ["tabindex", "0", "role", "landmark"], ["mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "ngClass", "cal-draggable", "dropData", "dragAxis", "validateDrag", "touchStartLongPress", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "ngClass", "dropData", "dragAxis", "validateDrag", "touchStartLongPress"], [1, "cal-event", 3, "ngStyle"], ["view", "month", "tabindex", "0", 3, "event", "customTemplate", "mwlClick", "mwlKeydownEnter"], [3, "event", "customTemplate"]],
  template: function CalendarOpenDayEventsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarOpenDayEventsComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarOpenDayEventsComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction5"](2, _c14, ctx.events, ctx.eventClicked, ctx.isOpen, ctx.trackByEventId, ctx.validateDrag));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DraggableDirective, CalendarEventActionsComponent, CalendarEventTitleComponent, ClickDirective, KeydownEnterDirective, CalendarA11yPipe],
  encapsulation: 2,
  data: {
    animation: [collapseAnimation]
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarOpenDayEventsComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-open-day-events',
      template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked"
      let-isOpen="isOpen"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-open-day-events"
        [@collapse]
        *ngIf="isOpen"
        role="application"
      >
        <span
          tabindex="-1"
          role="alert"
          [attr.aria-label]="
            { date: date, locale: locale } | calendarA11y : 'openDayEventsAlert'
          "
        ></span>
        <span
          tabindex="0"
          role="landmark"
          [attr.aria-label]="
            { date: date, locale: locale }
              | calendarA11y : 'openDayEventsLandmark'
          "
        ></span>
        <div
          *ngFor="let event of events; trackBy: trackByEventId"
          [ngClass]="event?.cssClass"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
        >
          <span
            class="cal-event"
            [ngStyle]="{ backgroundColor: event.color?.primary }"
          >
          </span>
          &ngsp;
          <mwl-calendar-event-title
            [event]="event"
            [customTemplate]="eventTitleTemplate"
            view="month"
            (mwlClick)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            (mwlKeydownEnter)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            tabindex="0"
            [attr.aria-label]="
              { event: event, locale: locale }
                | calendarA11y : 'eventDescription'
            "
          >
          </mwl-calendar-event-title>
          &ngsp;
          <mwl-calendar-event-actions
            [event]="event"
            [customTemplate]="eventActionsTemplate"
          >
          </mwl-calendar-event-actions>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        events: events,
        eventClicked: eventClicked,
        isOpen: isOpen,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
      animations: [collapseAnimation]
    }]
  }], null, {
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    isOpen: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    date: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarMonthViewHeaderComponent {
  constructor() {
    this.columnHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
  }
}
CalendarMonthViewHeaderComponent.ɵfac = function CalendarMonthViewHeaderComponent_Factory(t) {
  return new (t || CalendarMonthViewHeaderComponent)();
};
CalendarMonthViewHeaderComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarMonthViewHeaderComponent,
  selectors: [["mwl-calendar-month-view-header"]],
  inputs: {
    days: "days",
    locale: "locale",
    customTemplate: "customTemplate"
  },
  outputs: {
    columnHeaderClicked: "columnHeaderClicked"
  },
  decls: 3,
  vars: 6,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["role", "row", 1, "cal-cell-row", "cal-header"], ["class", "cal-cell", "tabindex", "0", "role", "columnheader", 3, "cal-past", "cal-today", "cal-future", "cal-weekend", "ngClass", "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["tabindex", "0", "role", "columnheader", 1, "cal-cell", 3, "ngClass", "click"]],
  template: function CalendarMonthViewHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarMonthViewHeaderComponent_ng_template_0_Template, 2, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarMonthViewHeaderComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](2, _c15, ctx.days, ctx.locale, ctx.trackByWeekDayHeaderDate));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, CalendarDatePipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthViewHeaderComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-month-view-header',
      template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-trackByWeekDayHeaderDate="trackByWeekDayHeaderDate"
    >
      <div class="cal-cell-row cal-header" role="row">
        <div
          class="cal-cell"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          (click)="
            columnHeaderClicked.emit({
              isoDayNumber: day.day,
              sourceEvent: $event
            })
          "
          [ngClass]="day.cssClass"
          tabindex="0"
          role="columnheader"
        >
          {{ day.date | calendarDate : 'monthViewColumnHeader' : locale }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        days: days,
        locale: locale,
        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    days: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    columnHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();

/**
 * Shows all events on a given month. Example usage:
 *
 * ```typescript
 * <mwl-calendar-month-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-month-view>
 * ```
 */
class CalendarMonthViewComponent {
  /**
   * @hidden
   */
  constructor(cdr, utils, locale, dateAdapter) {
    this.cdr = cdr;
    this.utils = utils;
    this.dateAdapter = dateAdapter;
    /**
     * An array of events to display on view.
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    this.events = [];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    this.excludeDays = [];
    /**
     * Whether the events list for the day of the `viewDate` option is visible or not
     */
    this.activeDayIsOpen = false;
    /**
     * The placement of the event tooltip
     */
    this.tooltipPlacement = 'auto';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = true;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = null;
    /**
     * An output that will be called before the view is rendered for the current month.
     * If you add the `cssClass` property to a day in the body it will add that class to the cell element in the template
     */
    this.beforeViewRender = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the day cell is clicked
     */
    this.dayClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the event title is clicked
     */
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a header week day is clicked. Returns ISO day number.
     */
    this.columnHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event is dragged and dropped
     */
    this.eventTimesChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * @hidden
     */
    this.trackByRowOffset = (index, offset) => this.view.days.slice(offset, this.view.totalDaysVisibleInWeek).map(day => day.date.toISOString()).join('-');
    /**
     * @hidden
     */
    this.trackByDate = (index, day) => day.date.toISOString();
    this.locale = locale;
  }
  /**
   * @hidden
   */
  ngOnInit() {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }
  /**
   * @hidden
   */
  ngOnChanges(changes) {
    const refreshHeader = changes.viewDate || changes.excludeDays || changes.weekendDays;
    const refreshBody = changes.viewDate || changes.events || changes.excludeDays || changes.weekendDays;
    if (refreshHeader) {
      this.refreshHeader();
    }
    if (changes.events) {
      validateEvents(this.events);
    }
    if (refreshBody) {
      this.refreshBody();
    }
    if (refreshHeader || refreshBody) {
      this.emitBeforeViewRender();
    }
    if (changes.activeDayIsOpen || changes.viewDate || changes.events || changes.excludeDays || changes.activeDay) {
      this.checkActiveDayIsOpen();
    }
  }
  /**
   * @hidden
   */
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  /**
   * @hidden
   */
  toggleDayHighlight(event, isHighlighted) {
    this.view.days.forEach(day => {
      if (isHighlighted && day.events.indexOf(event) > -1) {
        day.backgroundColor = event.color && event.color.secondary || '#D1E8FF';
      } else {
        delete day.backgroundColor;
      }
    });
  }
  /**
   * @hidden
   */
  eventDropped(droppedOn, event, draggedFrom) {
    if (droppedOn !== draggedFrom) {
      const year = this.dateAdapter.getYear(droppedOn.date);
      const month = this.dateAdapter.getMonth(droppedOn.date);
      const date = this.dateAdapter.getDate(droppedOn.date);
      const newStart = this.dateAdapter.setDate(this.dateAdapter.setMonth(this.dateAdapter.setYear(event.start, year), month), date);
      let newEnd;
      if (event.end) {
        const secondsDiff = this.dateAdapter.differenceInSeconds(newStart, event.start);
        newEnd = this.dateAdapter.addSeconds(event.end, secondsDiff);
      }
      this.eventTimesChanged.emit({
        event,
        newStart,
        newEnd,
        day: droppedOn,
        type: CalendarEventTimesChangedEventType.Drop
      });
    }
  }
  refreshHeader() {
    this.columnHeaders = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
  }
  refreshBody() {
    this.view = this.utils.getMonthView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
  }
  checkActiveDayIsOpen() {
    if (this.activeDayIsOpen === true) {
      const activeDay = this.activeDay || this.viewDate;
      this.openDay = this.view.days.find(day => this.dateAdapter.isSameDay(day.date, activeDay));
      const index = this.view.days.indexOf(this.openDay);
      this.openRowIndex = Math.floor(index / this.view.totalDaysVisibleInWeek) * this.view.totalDaysVisibleInWeek;
    } else {
      this.openRowIndex = null;
      this.openDay = null;
    }
  }
  refreshAll() {
    this.refreshHeader();
    this.refreshBody();
    this.emitBeforeViewRender();
    this.checkActiveDayIsOpen();
  }
  emitBeforeViewRender() {
    if (this.columnHeaders && this.view) {
      this.beforeViewRender.emit({
        header: this.columnHeaders,
        body: this.view.days,
        period: this.view.period
      });
    }
  }
}
CalendarMonthViewComponent.ɵfac = function CalendarMonthViewComponent_Factory(t) {
  return new (t || CalendarMonthViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarUtils), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarMonthViewComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarMonthViewComponent,
  selectors: [["mwl-calendar-month-view"]],
  inputs: {
    viewDate: "viewDate",
    events: "events",
    excludeDays: "excludeDays",
    activeDayIsOpen: "activeDayIsOpen",
    activeDay: "activeDay",
    refresh: "refresh",
    locale: "locale",
    tooltipPlacement: "tooltipPlacement",
    tooltipTemplate: "tooltipTemplate",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDelay: "tooltipDelay",
    weekStartsOn: "weekStartsOn",
    headerTemplate: "headerTemplate",
    cellTemplate: "cellTemplate",
    openDayEventsTemplate: "openDayEventsTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    weekendDays: "weekendDays"
  },
  outputs: {
    beforeViewRender: "beforeViewRender",
    dayClicked: "dayClicked",
    eventClicked: "eventClicked",
    columnHeaderClicked: "columnHeaderClicked",
    eventTimesChanged: "eventTimesChanged"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 4,
  vars: 5,
  consts: [["role", "grid", 1, "cal-month-view"], [3, "days", "locale", "customTemplate", "columnHeaderClicked"], [1, "cal-days"], [4, "ngFor", "ngForOf", "ngForTrackBy"], ["role", "row", 1, "cal-cell-row"], ["role", "gridcell", "mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "ngClass", "day", "openDay", "locale", "tooltipPlacement", "tooltipAppendToBody", "tooltipTemplate", "tooltipDelay", "customTemplate", "ngStyle", "clickListenerDisabled", "mwlClick", "mwlKeydownEnter", "highlightDay", "unhighlightDay", "drop", "eventClicked", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "locale", "isOpen", "events", "date", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "eventClicked", "drop"], ["role", "gridcell", "mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "ngClass", "day", "openDay", "locale", "tooltipPlacement", "tooltipAppendToBody", "tooltipTemplate", "tooltipDelay", "customTemplate", "ngStyle", "clickListenerDisabled", "mwlClick", "mwlKeydownEnter", "highlightDay", "unhighlightDay", "drop", "eventClicked"]],
  template: function CalendarMonthViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "mwl-calendar-month-view-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("columnHeaderClicked", function CalendarMonthViewComponent_Template_mwl_calendar_month_view_header_columnHeaderClicked_1_listener($event) {
        return ctx.columnHeaderClicked.emit($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarMonthViewComponent_div_3_Template, 5, 13, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("days", ctx.columnHeaders)("locale", ctx.locale)("customTemplate", ctx.headerTemplate);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.view.rowOffsets)("ngForTrackBy", ctx.trackByRowOffset);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DroppableDirective, ClickDirective, KeydownEnterDirective, CalendarMonthCellComponent, CalendarOpenDayEventsComponent, CalendarMonthViewHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_6__.SlicePipe, CalendarA11yPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthViewComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-month-view',
      template: `
    <div class="cal-month-view" role="grid">
      <mwl-calendar-month-view-header
        [days]="columnHeaders"
        [locale]="locale"
        (columnHeaderClicked)="columnHeaderClicked.emit($event)"
        [customTemplate]="headerTemplate"
      >
      </mwl-calendar-month-view-header>
      <div class="cal-days">
        <div
          *ngFor="let rowIndex of view.rowOffsets; trackBy: trackByRowOffset"
        >
          <div role="row" class="cal-cell-row">
            <mwl-calendar-month-cell
              role="gridcell"
              *ngFor="
                let day of view.days
                  | slice : rowIndex : rowIndex + view.totalDaysVisibleInWeek;
                trackBy: trackByDate
              "
              [ngClass]="day?.cssClass"
              [day]="day"
              [openDay]="openDay"
              [locale]="locale"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="cellTemplate"
              [ngStyle]="{ backgroundColor: day.backgroundColor }"
              (mwlClick)="dayClicked.emit({ day: day, sourceEvent: $event })"
              [clickListenerDisabled]="dayClicked.observers.length === 0"
              (mwlKeydownEnter)="
                dayClicked.emit({ day: day, sourceEvent: $event })
              "
              (highlightDay)="toggleDayHighlight($event.event, true)"
              (unhighlightDay)="toggleDayHighlight($event.event, false)"
              mwlDroppable
              dragOverClass="cal-drag-over"
              (drop)="
                eventDropped(
                  day,
                  $event.dropData.event,
                  $event.dropData.draggedFrom
                )
              "
              (eventClicked)="
                eventClicked.emit({
                  event: $event.event,
                  sourceEvent: $event.sourceEvent
                })
              "
              [attr.tabindex]="{} | calendarA11y : 'monthCellTabIndex'"
            >
            </mwl-calendar-month-cell>
          </div>
          <mwl-calendar-open-day-events
            [locale]="locale"
            [isOpen]="openRowIndex === rowIndex"
            [events]="openDay?.events"
            [date]="openDay?.date"
            [customTemplate]="openDayEventsTemplate"
            [eventTitleTemplate]="eventTitleTemplate"
            [eventActionsTemplate]="eventActionsTemplate"
            (eventClicked)="
              eventClicked.emit({
                event: $event.event,
                sourceEvent: $event.sourceEvent
              })
            "
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="
              eventDropped(
                openDay,
                $event.dropData.event,
                $event.dropData.draggedFrom
              )
            "
          >
          </mwl-calendar-open-day-events>
        </div>
      </div>
    </div>
  `
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef
    }, {
      type: CalendarUtils
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }, {
      type: DateAdapter
    }];
  }, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    activeDayIsOpen: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    activeDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    refresh: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekStartsOn: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    headerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    cellTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    openDayEventsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekendDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    beforeViewRender: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dayClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    columnHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarMonthModule {}
CalendarMonthModule.ɵfac = function CalendarMonthModule_Factory(t) {
  return new (t || CalendarMonthModule)();
};
CalendarMonthModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarMonthModule
});
CalendarMonthModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule],
      declarations: [CalendarMonthViewComponent, CalendarMonthCellComponent, CalendarOpenDayEventsComponent, CalendarMonthViewHeaderComponent],
      exports: [angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarMonthViewComponent, CalendarMonthCellComponent, CalendarOpenDayEventsComponent, CalendarMonthViewHeaderComponent]
    }]
  }], null, null);
})();
class CalendarDragHelper {
  constructor(dragContainerElement, draggableElement) {
    this.dragContainerElement = dragContainerElement;
    this.startPosition = draggableElement.getBoundingClientRect();
  }
  validateDrag({
    x,
    y,
    snapDraggedEvents,
    dragAlreadyMoved,
    transform
  }) {
    const isDraggedWithinThreshold = isWithinThreshold({
      x,
      y
    }) || dragAlreadyMoved;
    if (snapDraggedEvents) {
      const inner = Object.assign({}, this.startPosition, {
        left: this.startPosition.left + transform.x,
        right: this.startPosition.right + transform.x,
        top: this.startPosition.top + transform.y,
        bottom: this.startPosition.bottom + transform.y
      });
      if (isDraggedWithinThreshold) {
        const outer = this.dragContainerElement.getBoundingClientRect();
        const isTopInside = outer.top < inner.top && inner.top < outer.bottom;
        const isBottomInside = outer.top < inner.bottom && inner.bottom < outer.bottom;
        return isInsideLeftAndRight(outer, inner) && (isTopInside || isBottomInside);
      }
      /* istanbul ignore next */
      return false;
    } else {
      return isDraggedWithinThreshold;
    }
  }
}
class CalendarResizeHelper {
  constructor(resizeContainerElement, minWidth, rtl) {
    this.resizeContainerElement = resizeContainerElement;
    this.minWidth = minWidth;
    this.rtl = rtl;
  }
  validateResize({
    rectangle,
    edges
  }) {
    if (this.rtl) {
      // TODO - find a way of testing this, for some reason the tests always fail but it does actually work
      /* istanbul ignore next */
      if (typeof edges.left !== 'undefined') {
        rectangle.left -= edges.left;
        rectangle.right += edges.left;
      } else if (typeof edges.right !== 'undefined') {
        rectangle.left += edges.right;
        rectangle.right -= edges.right;
      }
      rectangle.width = rectangle.right - rectangle.left;
    }
    if (this.minWidth && Math.ceil(rectangle.width) < Math.ceil(this.minWidth)) {
      return false;
    }
    return isInside(this.resizeContainerElement.getBoundingClientRect(), rectangle);
  }
}
class CalendarWeekViewHeaderComponent {
  constructor() {
    this.dayHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.eventDropped = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.dragEnter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
  }
}
CalendarWeekViewHeaderComponent.ɵfac = function CalendarWeekViewHeaderComponent_Factory(t) {
  return new (t || CalendarWeekViewHeaderComponent)();
};
CalendarWeekViewHeaderComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewHeaderComponent,
  selectors: [["mwl-calendar-week-view-header"]],
  inputs: {
    days: "days",
    locale: "locale",
    customTemplate: "customTemplate"
  },
  outputs: {
    dayHeaderClicked: "dayHeaderClicked",
    eventDropped: "eventDropped",
    dragEnter: "dragEnter"
  },
  decls: 3,
  vars: 9,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["role", "row", 1, "cal-day-headers"], ["class", "cal-header", "mwlDroppable", "", "dragOverClass", "cal-drag-over", "tabindex", "0", "role", "columnheader", 3, "cal-past", "cal-today", "cal-future", "cal-weekend", "ngClass", "mwlClick", "drop", "dragEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragOverClass", "cal-drag-over", "tabindex", "0", "role", "columnheader", 1, "cal-header", 3, "ngClass", "mwlClick", "drop", "dragEnter"]],
  template: function CalendarWeekViewHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewHeaderComponent_ng_template_0_Template, 2, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarWeekViewHeaderComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction6"](2, _c16, ctx.days, ctx.locale, ctx.dayHeaderClicked, ctx.eventDropped, ctx.dragEnter, ctx.trackByWeekDayHeaderDate));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DroppableDirective, ClickDirective, CalendarDatePipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewHeaderComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-header',
      template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-dayHeaderClicked="dayHeaderClicked"
      let-eventDropped="eventDropped"
      let-trackByWeekDayHeaderDate="trackByWeekDayHeaderDate"
      let-dragEnter="dragEnter"
    >
      <div class="cal-day-headers" role="row">
        <div
          class="cal-header"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [ngClass]="day.cssClass"
          (mwlClick)="dayHeaderClicked.emit({ day: day, sourceEvent: $event })"
          mwlDroppable
          dragOverClass="cal-drag-over"
          (drop)="
            eventDropped.emit({
              event: $event.dropData.event,
              newStart: day.date
            })
          "
          (dragEnter)="dragEnter.emit({ date: day.date })"
          tabindex="0"
          role="columnheader"
        >
          <b>{{ day.date | calendarDate : 'weekViewColumnHeader' : locale }}</b
          ><br />
          <span>{{
            day.date | calendarDate : 'weekViewColumnSubHeader' : locale
          }}</span>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        days: days,
        locale: locale,
        dayHeaderClicked: dayHeaderClicked,
        eventDropped: eventDropped,
        dragEnter: dragEnter,
        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    days: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventDropped: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragEnter: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarWeekViewEventComponent {
  constructor() {
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
}
CalendarWeekViewEventComponent.ɵfac = function CalendarWeekViewEventComponent_Factory(t) {
  return new (t || CalendarWeekViewEventComponent)();
};
CalendarWeekViewEventComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewEventComponent,
  selectors: [["mwl-calendar-week-view-event"]],
  inputs: {
    locale: "locale",
    weekEvent: "weekEvent",
    tooltipPlacement: "tooltipPlacement",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDisabled: "tooltipDisabled",
    tooltipDelay: "tooltipDelay",
    customTemplate: "customTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    tooltipTemplate: "tooltipTemplate",
    column: "column",
    daysInWeek: "daysInWeek"
  },
  outputs: {
    eventClicked: "eventClicked"
  },
  decls: 3,
  vars: 12,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["tabindex", "0", "role", "application", 1, "cal-event", 3, "ngStyle", "mwlCalendarTooltip", "tooltipPlacement", "tooltipEvent", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "mwlClick", "mwlKeydownEnter"], [3, "event", "customTemplate"], [3, "event", "customTemplate", "view"]],
  template: function CalendarWeekViewEventComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewEventComponent_ng_template_0_Template, 6, 27, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarWeekViewEventComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunctionV"](2, _c18, [ctx.weekEvent, ctx.tooltipPlacement, ctx.eventClicked, ctx.tooltipTemplate, ctx.tooltipAppendToBody, ctx.tooltipDisabled, ctx.tooltipDelay, ctx.column, ctx.daysInWeek]));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, CalendarEventActionsComponent, CalendarEventTitleComponent, CalendarTooltipDirective, ClickDirective, KeydownEnterDirective, CalendarEventTitlePipe, CalendarA11yPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewEventComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-event',
      template: `
    <ng-template
      #defaultTemplate
      let-weekEvent="weekEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDisabled="tooltipDisabled"
      let-tooltipDelay="tooltipDelay"
      let-column="column"
      let-daysInWeek="daysInWeek"
    >
      <div
        class="cal-event"
        [ngStyle]="{
          color: weekEvent.event.color?.secondaryText,
          backgroundColor: weekEvent.event.color?.secondary,
          borderColor: weekEvent.event.color?.primary
        }"
        [mwlCalendarTooltip]="
          !tooltipDisabled
            ? (weekEvent.event.title
              | calendarEventTitle
                : (daysInWeek === 1 ? 'dayTooltip' : 'weekTooltip')
                : weekEvent.tempEvent || weekEvent.event)
            : ''
        "
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="weekEvent.tempEvent || weekEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody"
        [tooltipDelay]="tooltipDelay"
        (mwlClick)="eventClicked.emit({ sourceEvent: $event })"
        (mwlKeydownEnter)="eventClicked.emit({ sourceEvent: $event })"
        tabindex="0"
        role="application"
        [attr.aria-label]="
          { event: weekEvent.tempEvent || weekEvent.event, locale: locale }
            | calendarA11y : 'eventDescription'
        "
      >
        <mwl-calendar-event-actions
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventActionsTemplate"
        >
        </mwl-calendar-event-actions>
        &ngsp;
        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
        >
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        weekEvent: weekEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDisabled: tooltipDisabled,
        tooltipDelay: tooltipDelay,
        column: column,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekEvent: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    column: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarWeekViewHourSegmentComponent {}
CalendarWeekViewHourSegmentComponent.ɵfac = function CalendarWeekViewHourSegmentComponent_Factory(t) {
  return new (t || CalendarWeekViewHourSegmentComponent)();
};
CalendarWeekViewHourSegmentComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewHourSegmentComponent,
  selectors: [["mwl-calendar-week-view-hour-segment"]],
  inputs: {
    segment: "segment",
    segmentHeight: "segmentHeight",
    locale: "locale",
    isTimeLabel: "isTimeLabel",
    daysInWeek: "daysInWeek",
    customTemplate: "customTemplate"
  },
  decls: 3,
  vars: 8,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-hour-segment", 3, "ngClass"], ["class", "cal-time", 4, "ngIf"], [1, "cal-time"]],
  template: function CalendarWeekViewHourSegmentComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewHourSegmentComponent_ng_template_0_Template, 3, 13, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarWeekViewHourSegmentComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction5"](2, _c19, ctx.segment, ctx.locale, ctx.segmentHeight, ctx.isTimeLabel, ctx.daysInWeek));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, CalendarDatePipe, CalendarA11yPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewHourSegmentComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-hour-segment',
      template: `
    <ng-template
      #defaultTemplate
      let-segment="segment"
      let-locale="locale"
      let-segmentHeight="segmentHeight"
      let-isTimeLabel="isTimeLabel"
      let-daysInWeek="daysInWeek"
    >
      <div
        [attr.aria-hidden]="
          {}
            | calendarA11y
              : (daysInWeek === 1
                  ? 'hideDayHourSegment'
                  : 'hideWeekHourSegment')
        "
        class="cal-hour-segment"
        [style.height.px]="segmentHeight"
        [class.cal-hour-start]="segment.isStart"
        [class.cal-after-hour-start]="!segment.isStart"
        [ngClass]="segment.cssClass"
      >
        <div class="cal-time" *ngIf="isTimeLabel">
          {{
            segment.displayDate
              | calendarDate
                : (daysInWeek === 1 ? 'dayViewHour' : 'weekViewHour')
                : locale
          }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        segment: segment,
        locale: locale,
        segmentHeight: segmentHeight,
        isTimeLabel: isTimeLabel,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    segment: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    segmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    isTimeLabel: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();
class CalendarWeekViewCurrentTimeMarkerComponent {
  constructor(dateAdapter, zone) {
    this.dateAdapter = dateAdapter;
    this.zone = zone;
    this.columnDate$ = new rxjs__WEBPACK_IMPORTED_MODULE_11__.BehaviorSubject(undefined);
    this.marker$ = this.zone.onStable.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.switchMap)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.interval)(60 * 1000)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.startWith)(0), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.switchMapTo)(this.columnDate$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.map)(columnDate => {
      const startOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayStartHour), this.dayStartMinute);
      const endOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayEndHour), this.dayEndMinute);
      const hourHeightModifier = this.hourSegments * this.hourSegmentHeight / (this.hourDuration || 60);
      const now = new Date();
      return {
        isVisible: this.dateAdapter.isSameDay(columnDate, now) && now >= startOfDay && now <= endOfDay,
        top: this.dateAdapter.differenceInMinutes(now, startOfDay) * hourHeightModifier
      };
    }));
  }
  ngOnChanges(changes) {
    if (changes.columnDate) {
      this.columnDate$.next(changes.columnDate.currentValue);
    }
  }
}
CalendarWeekViewCurrentTimeMarkerComponent.ɵfac = function CalendarWeekViewCurrentTimeMarkerComponent_Factory(t) {
  return new (t || CalendarWeekViewCurrentTimeMarkerComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone));
};
CalendarWeekViewCurrentTimeMarkerComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewCurrentTimeMarkerComponent,
  selectors: [["mwl-calendar-week-view-current-time-marker"]],
  inputs: {
    columnDate: "columnDate",
    dayStartHour: "dayStartHour",
    dayStartMinute: "dayStartMinute",
    dayEndHour: "dayEndHour",
    dayEndMinute: "dayEndMinute",
    hourSegments: "hourSegments",
    hourDuration: "hourDuration",
    hourSegmentHeight: "hourSegmentHeight",
    customTemplate: "customTemplate"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 5,
  vars: 14,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "cal-current-time-marker", 3, "top", 4, "ngIf"], [1, "cal-current-time-marker"]],
  template: function CalendarWeekViewCurrentTimeMarkerComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"])(2, CalendarWeekViewCurrentTimeMarkerComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "async");
    }
    if (rf & 2) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      let tmp_1_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction7"](6, _c20, ctx.columnDate, ctx.dayStartHour, ctx.dayStartMinute, ctx.dayEndHour, ctx.dayEndMinute, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 2, ctx.marker$)) == null ? null : tmp_1_0.isVisible, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](4, 4, ctx.marker$)) == null ? null : tmp_1_0.top));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.AsyncPipe],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewCurrentTimeMarkerComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-current-time-marker',
      template: `
    <ng-template
      #defaultTemplate
      let-columnDate="columnDate"
      let-dayStartHour="dayStartHour"
      let-dayStartMinute="dayStartMinute"
      let-dayEndHour="dayEndHour"
      let-dayEndMinute="dayEndMinute"
      let-isVisible="isVisible"
      let-topPx="topPx"
    >
      <div
        class="cal-current-time-marker"
        *ngIf="isVisible"
        [style.top.px]="topPx"
      ></div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        columnDate: columnDate,
        dayStartHour: dayStartHour,
        dayStartMinute: dayStartMinute,
        dayEndHour: dayEndHour,
        dayEndMinute: dayEndMinute,
        isVisible: (marker$ | async)?.isVisible,
        topPx: (marker$ | async)?.top
      }"
    >
    </ng-template>
  `
    }]
  }], function () {
    return [{
      type: DateAdapter
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }];
  }, {
    columnDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegments: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourDuration: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();

/**
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
class CalendarWeekViewComponent {
  /**
   * @hidden
   */
  constructor(cdr, utils, locale, dateAdapter, element) {
    this.cdr = cdr;
    this.utils = utils;
    this.dateAdapter = dateAdapter;
    this.element = element;
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    this.events = [];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    this.excludeDays = [];
    /**
     * The placement of the event tooltip
     */
    this.tooltipPlacement = 'auto';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = true;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = null;
    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    this.precision = 'days';
    /**
     * Whether to snap events to a grid when dragging
     */
    this.snapDraggedEvents = true;
    /**
     * The number of segments in an hour. Must divide equally into 60.
     */
    this.hourSegments = 2;
    /**
     * The height in pixels of each hour segment
     */
    this.hourSegmentHeight = 30;
    /**
     * The minimum height in pixels of each event
     */
    this.minimumEventHeight = 30;
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    this.dayStartHour = 0;
    /**
     * The day start minutes. Must be 0-59
     */
    this.dayStartMinute = 0;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    this.dayEndHour = 23;
    /**
     * The day end minutes. Must be 0-59
     */
    this.dayEndMinute = 59;
    /**
     * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
     */
    this.dayHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event title is clicked
     */
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event is resized or dragged and dropped
     */
    this.eventTimesChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * An output that will be called before the view is rendered for the current week.
     * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
     */
    this.beforeViewRender = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an hour segment is clicked
     */
    this.hourSegmentClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * @hidden
     */
    this.allDayEventResizes = new Map();
    /**
     * @hidden
     */
    this.timeEventResizes = new Map();
    /**
     * @hidden
     */
    this.eventDragEnterByType = {
      allDay: 0,
      time: 0
    };
    /**
     * @hidden
     */
    this.dragActive = false;
    /**
     * @hidden
     */
    this.dragAlreadyMoved = false;
    /**
     * @hidden
     */
    this.calendarId = Symbol('angular calendar week view id');
    /**
     * @hidden
     */
    this.rtl = false;
    /**
     * @hidden
     */
    this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    /**
     * @hidden
     */
    this.trackByHourSegment = trackByHourSegment;
    /**
     * @hidden
     */
    this.trackByHour = trackByHour;
    /**
     * @hidden
     */
    this.trackByWeekAllDayEvent = trackByWeekAllDayEvent;
    /**
     * @hidden
     */
    this.trackByWeekTimeEvent = trackByWeekTimeEvent;
    /**
     * @hidden
     */
    this.trackByHourColumn = (index, column) => column.hours[0] ? column.hours[0].segments[0].date.toISOString() : column;
    /**
     * @hidden
     */
    this.trackById = (index, row) => row.id;
    this.locale = locale;
  }
  /**
   * @hidden
   */
  ngOnInit() {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }
  /**
   * @hidden
   */
  ngOnChanges(changes) {
    const refreshHeader = changes.viewDate || changes.excludeDays || changes.weekendDays || changes.daysInWeek || changes.weekStartsOn;
    const refreshBody = changes.viewDate || changes.dayStartHour || changes.dayStartMinute || changes.dayEndHour || changes.dayEndMinute || changes.hourSegments || changes.hourDuration || changes.weekStartsOn || changes.weekendDays || changes.excludeDays || changes.hourSegmentHeight || changes.events || changes.daysInWeek || changes.minimumEventHeight;
    if (refreshHeader) {
      this.refreshHeader();
    }
    if (changes.events) {
      validateEvents(this.events);
    }
    if (refreshBody) {
      this.refreshBody();
    }
    if (refreshHeader || refreshBody) {
      this.emitBeforeViewRender();
    }
  }
  /**
   * @hidden
   */
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  /**
   * @hidden
   */
  ngAfterViewInit() {
    this.rtl = typeof window !== 'undefined' && getComputedStyle(this.element.nativeElement).direction === 'rtl';
    this.cdr.detectChanges();
  }
  /**
   * @hidden
   */
  timeEventResizeStarted(eventsContainer, timeEvent, resizeEvent) {
    this.timeEventResizes.set(timeEvent.event, resizeEvent);
    this.resizeStarted(eventsContainer, timeEvent);
  }
  /**
   * @hidden
   */
  timeEventResizing(timeEvent, resizeEvent) {
    this.timeEventResizes.set(timeEvent.event, resizeEvent);
    const adjustedEvents = new Map();
    const tempEvents = [...this.events];
    this.timeEventResizes.forEach((lastResizeEvent, event) => {
      const newEventDates = this.getTimeEventResizedDates(event, lastResizeEvent);
      const adjustedEvent = {
        ...event,
        ...newEventDates
      };
      adjustedEvents.set(adjustedEvent, event);
      const eventIndex = tempEvents.indexOf(event);
      tempEvents[eventIndex] = adjustedEvent;
    });
    this.restoreOriginalEvents(tempEvents, adjustedEvents, true);
  }
  /**
   * @hidden
   */
  timeEventResizeEnded(timeEvent) {
    this.view = this.getWeekView(this.events);
    const lastResizeEvent = this.timeEventResizes.get(timeEvent.event);
    if (lastResizeEvent) {
      this.timeEventResizes.delete(timeEvent.event);
      const newEventDates = this.getTimeEventResizedDates(timeEvent.event, lastResizeEvent);
      this.eventTimesChanged.emit({
        newStart: newEventDates.start,
        newEnd: newEventDates.end,
        event: timeEvent.event,
        type: CalendarEventTimesChangedEventType.Resize
      });
    }
  }
  /**
   * @hidden
   */
  allDayEventResizeStarted(allDayEventsContainer, allDayEvent, resizeEvent) {
    this.allDayEventResizes.set(allDayEvent, {
      originalOffset: allDayEvent.offset,
      originalSpan: allDayEvent.span,
      edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right'
    });
    this.resizeStarted(allDayEventsContainer, allDayEvent, this.getDayColumnWidth(allDayEventsContainer));
  }
  /**
   * @hidden
   */
  allDayEventResizing(allDayEvent, resizeEvent, dayWidth) {
    const currentResize = this.allDayEventResizes.get(allDayEvent);
    const modifier = this.rtl ? -1 : 1;
    if (typeof resizeEvent.edges.left !== 'undefined') {
      const diff = Math.round(+resizeEvent.edges.left / dayWidth) * modifier;
      allDayEvent.offset = currentResize.originalOffset + diff;
      allDayEvent.span = currentResize.originalSpan - diff;
    } else if (typeof resizeEvent.edges.right !== 'undefined') {
      const diff = Math.round(+resizeEvent.edges.right / dayWidth) * modifier;
      allDayEvent.span = currentResize.originalSpan + diff;
    }
  }
  /**
   * @hidden
   */
  allDayEventResizeEnded(allDayEvent) {
    const currentResize = this.allDayEventResizes.get(allDayEvent);
    if (currentResize) {
      const allDayEventResizingBeforeStart = currentResize.edge === 'left';
      let daysDiff;
      if (allDayEventResizingBeforeStart) {
        daysDiff = allDayEvent.offset - currentResize.originalOffset;
      } else {
        daysDiff = allDayEvent.span - currentResize.originalSpan;
      }
      allDayEvent.offset = currentResize.originalOffset;
      allDayEvent.span = currentResize.originalSpan;
      const newDates = this.getAllDayEventResizedDates(allDayEvent.event, daysDiff, allDayEventResizingBeforeStart);
      this.eventTimesChanged.emit({
        newStart: newDates.start,
        newEnd: newDates.end,
        event: allDayEvent.event,
        type: CalendarEventTimesChangedEventType.Resize
      });
      this.allDayEventResizes.delete(allDayEvent);
    }
  }
  /**
   * @hidden
   */
  getDayColumnWidth(eventRowContainer) {
    return Math.floor(eventRowContainer.offsetWidth / this.days.length);
  }
  /**
   * @hidden
   */
  dateDragEnter(date) {
    this.lastDragEnterDate = date;
  }
  /**
   * @hidden
   */
  eventDropped(dropEvent, date, allDay) {
    if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId) && this.lastDragEnterDate.getTime() === date.getTime() && (!this.snapDraggedEvents || dropEvent.dropData.event !== this.lastDraggedEvent)) {
      this.eventTimesChanged.emit({
        type: CalendarEventTimesChangedEventType.Drop,
        event: dropEvent.dropData.event,
        newStart: date,
        allDay
      });
    }
    this.lastDraggedEvent = null;
  }
  /**
   * @hidden
   */
  dragEnter(type) {
    this.eventDragEnterByType[type]++;
  }
  /**
   * @hidden
   */
  dragLeave(type) {
    this.eventDragEnterByType[type]--;
  }
  /**
   * @hidden
   */
  dragStarted(eventsContainerElement, eventElement, event, useY) {
    this.dayColumnWidth = this.getDayColumnWidth(eventsContainerElement);
    const dragHelper = new CalendarDragHelper(eventsContainerElement, eventElement);
    this.validateDrag = ({
      x,
      y,
      transform
    }) => {
      const isAllowed = this.allDayEventResizes.size === 0 && this.timeEventResizes.size === 0 && dragHelper.validateDrag({
        x,
        y,
        snapDraggedEvents: this.snapDraggedEvents,
        dragAlreadyMoved: this.dragAlreadyMoved,
        transform
      });
      if (isAllowed && this.validateEventTimesChanged) {
        const newEventTimes = this.getDragMovedEventTimes(event, {
          x,
          y
        }, this.dayColumnWidth, useY);
        return this.validateEventTimesChanged({
          type: CalendarEventTimesChangedEventType.Drag,
          event: event.event,
          newStart: newEventTimes.start,
          newEnd: newEventTimes.end
        });
      }
      return isAllowed;
    };
    this.dragActive = true;
    this.dragAlreadyMoved = false;
    this.lastDraggedEvent = null;
    this.eventDragEnterByType = {
      allDay: 0,
      time: 0
    };
    if (!this.snapDraggedEvents && useY) {
      this.view.hourColumns.forEach(column => {
        const linkedEvent = column.events.find(columnEvent => columnEvent.event === event.event && columnEvent !== event);
        // hide any linked events while dragging
        if (linkedEvent) {
          linkedEvent.width = 0;
          linkedEvent.height = 0;
        }
      });
    }
    this.cdr.markForCheck();
  }
  /**
   * @hidden
   */
  dragMove(dayEvent, dragEvent) {
    const newEventTimes = this.getDragMovedEventTimes(dayEvent, dragEvent, this.dayColumnWidth, true);
    const originalEvent = dayEvent.event;
    const adjustedEvent = {
      ...originalEvent,
      ...newEventTimes
    };
    const tempEvents = this.events.map(event => {
      if (event === originalEvent) {
        return adjustedEvent;
      }
      return event;
    });
    this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent, originalEvent]]), this.snapDraggedEvents);
    this.dragAlreadyMoved = true;
  }
  /**
   * @hidden
   */
  allDayEventDragMove() {
    this.dragAlreadyMoved = true;
  }
  /**
   * @hidden
   */
  dragEnded(weekEvent, dragEndEvent, dayWidth, useY = false) {
    this.view = this.getWeekView(this.events);
    this.dragActive = false;
    this.validateDrag = null;
    const {
      start,
      end
    } = this.getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY);
    if ((this.snapDraggedEvents || this.eventDragEnterByType[useY ? 'time' : 'allDay'] > 0) && isDraggedWithinPeriod(start, end, this.view.period)) {
      this.lastDraggedEvent = weekEvent.event;
      this.eventTimesChanged.emit({
        newStart: start,
        newEnd: end,
        event: weekEvent.event,
        type: CalendarEventTimesChangedEventType.Drag,
        allDay: !useY
      });
    }
  }
  refreshHeader() {
    this.days = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays,
      ...getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)
    });
  }
  refreshBody() {
    this.view = this.getWeekView(this.events);
  }
  refreshAll() {
    this.refreshHeader();
    this.refreshBody();
    this.emitBeforeViewRender();
  }
  emitBeforeViewRender() {
    if (this.days && this.view) {
      this.beforeViewRender.emit({
        header: this.days,
        ...this.view
      });
    }
  }
  getWeekView(events) {
    return this.utils.getWeekView({
      events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      precision: this.precision,
      absolutePositionedEvents: true,
      hourSegments: this.hourSegments,
      hourDuration: this.hourDuration,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute
      },
      segmentHeight: this.hourSegmentHeight,
      weekendDays: this.weekendDays,
      minimumEventHeight: this.minimumEventHeight,
      ...getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)
    });
  }
  getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY) {
    const daysDragged = roundToNearest(dragEndEvent.x, dayWidth) / dayWidth * (this.rtl ? -1 : 1);
    const minutesMoved = useY ? getMinutesMoved(dragEndEvent.y, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration) : 0;
    const start = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.start, daysDragged, this.excludeDays), minutesMoved);
    let end;
    if (weekEvent.event.end) {
      end = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.end, daysDragged, this.excludeDays), minutesMoved);
    }
    return {
      start,
      end
    };
  }
  restoreOriginalEvents(tempEvents, adjustedEvents, snapDraggedEvents = true) {
    const previousView = this.view;
    if (snapDraggedEvents) {
      this.view = this.getWeekView(tempEvents);
    }
    const adjustedEventsArray = tempEvents.filter(event => adjustedEvents.has(event));
    this.view.hourColumns.forEach((column, columnIndex) => {
      previousView.hourColumns[columnIndex].hours.forEach((hour, hourIndex) => {
        hour.segments.forEach((segment, segmentIndex) => {
          column.hours[hourIndex].segments[segmentIndex].cssClass = segment.cssClass;
        });
      });
      adjustedEventsArray.forEach(adjustedEvent => {
        const originalEvent = adjustedEvents.get(adjustedEvent);
        const existingColumnEvent = column.events.find(columnEvent => columnEvent.event === (snapDraggedEvents ? adjustedEvent : originalEvent));
        if (existingColumnEvent) {
          // restore the original event so trackBy kicks in and the dom isn't changed
          existingColumnEvent.event = originalEvent;
          existingColumnEvent['tempEvent'] = adjustedEvent;
          if (!snapDraggedEvents) {
            existingColumnEvent.height = 0;
            existingColumnEvent.width = 0;
          }
        } else {
          // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
          const event = {
            event: originalEvent,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            startsBeforeDay: false,
            endsAfterDay: false,
            tempEvent: adjustedEvent
          };
          column.events.push(event);
        }
      });
    });
    adjustedEvents.clear();
  }
  getTimeEventResizedDates(calendarEvent, resizeEvent) {
    const newEventDates = {
      start: calendarEvent.start,
      end: getDefaultEventEnd(this.dateAdapter, calendarEvent, this.minimumEventHeight)
    };
    const {
      end,
      ...eventWithoutEnd
    } = calendarEvent;
    const smallestResizes = {
      start: this.dateAdapter.addMinutes(newEventDates.end, this.minimumEventHeight * -1),
      end: getDefaultEventEnd(this.dateAdapter, eventWithoutEnd, this.minimumEventHeight)
    };
    const modifier = this.rtl ? -1 : 1;
    if (typeof resizeEvent.edges.left !== 'undefined') {
      const daysDiff = Math.round(+resizeEvent.edges.left / this.dayColumnWidth) * modifier;
      const newStart = addDaysWithExclusions(this.dateAdapter, newEventDates.start, daysDiff, this.excludeDays);
      if (newStart < smallestResizes.start) {
        newEventDates.start = newStart;
      } else {
        newEventDates.start = smallestResizes.start;
      }
    } else if (typeof resizeEvent.edges.right !== 'undefined') {
      const daysDiff = Math.round(+resizeEvent.edges.right / this.dayColumnWidth) * modifier;
      const newEnd = addDaysWithExclusions(this.dateAdapter, newEventDates.end, daysDiff, this.excludeDays);
      if (newEnd > smallestResizes.end) {
        newEventDates.end = newEnd;
      } else {
        newEventDates.end = smallestResizes.end;
      }
    }
    if (typeof resizeEvent.edges.top !== 'undefined') {
      const minutesMoved = getMinutesMoved(resizeEvent.edges.top, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration);
      const newStart = this.dateAdapter.addMinutes(newEventDates.start, minutesMoved);
      if (newStart < smallestResizes.start) {
        newEventDates.start = newStart;
      } else {
        newEventDates.start = smallestResizes.start;
      }
    } else if (typeof resizeEvent.edges.bottom !== 'undefined') {
      const minutesMoved = getMinutesMoved(resizeEvent.edges.bottom, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration);
      const newEnd = this.dateAdapter.addMinutes(newEventDates.end, minutesMoved);
      if (newEnd > smallestResizes.end) {
        newEventDates.end = newEnd;
      } else {
        newEventDates.end = smallestResizes.end;
      }
    }
    return newEventDates;
  }
  resizeStarted(eventsContainer, event, dayWidth) {
    this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
    const resizeHelper = new CalendarResizeHelper(eventsContainer, dayWidth, this.rtl);
    this.validateResize = ({
      rectangle,
      edges
    }) => {
      const isWithinBoundary = resizeHelper.validateResize({
        rectangle: {
          ...rectangle
        },
        edges
      });
      if (isWithinBoundary && this.validateEventTimesChanged) {
        let newEventDates;
        if (!dayWidth) {
          newEventDates = this.getTimeEventResizedDates(event.event, {
            rectangle,
            edges
          });
        } else {
          const modifier = this.rtl ? -1 : 1;
          if (typeof edges.left !== 'undefined') {
            const diff = Math.round(+edges.left / dayWidth) * modifier;
            newEventDates = this.getAllDayEventResizedDates(event.event, diff, !this.rtl);
          } else {
            const diff = Math.round(+edges.right / dayWidth) * modifier;
            newEventDates = this.getAllDayEventResizedDates(event.event, diff, this.rtl);
          }
        }
        return this.validateEventTimesChanged({
          type: CalendarEventTimesChangedEventType.Resize,
          event: event.event,
          newStart: newEventDates.start,
          newEnd: newEventDates.end
        });
      }
      return isWithinBoundary;
    };
    this.cdr.markForCheck();
  }
  /**
   * @hidden
   */
  getAllDayEventResizedDates(event, daysDiff, beforeStart) {
    let start = event.start;
    let end = event.end || event.start;
    if (beforeStart) {
      start = addDaysWithExclusions(this.dateAdapter, start, daysDiff, this.excludeDays);
    } else {
      end = addDaysWithExclusions(this.dateAdapter, end, daysDiff, this.excludeDays);
    }
    return {
      start,
      end
    };
  }
}
CalendarWeekViewComponent.ɵfac = function CalendarWeekViewComponent_Factory(t) {
  return new (t || CalendarWeekViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarUtils), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef));
};
CalendarWeekViewComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewComponent,
  selectors: [["mwl-calendar-week-view"]],
  inputs: {
    viewDate: "viewDate",
    events: "events",
    excludeDays: "excludeDays",
    refresh: "refresh",
    locale: "locale",
    tooltipPlacement: "tooltipPlacement",
    tooltipTemplate: "tooltipTemplate",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDelay: "tooltipDelay",
    weekStartsOn: "weekStartsOn",
    headerTemplate: "headerTemplate",
    eventTemplate: "eventTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    precision: "precision",
    weekendDays: "weekendDays",
    snapDraggedEvents: "snapDraggedEvents",
    hourSegments: "hourSegments",
    hourDuration: "hourDuration",
    hourSegmentHeight: "hourSegmentHeight",
    minimumEventHeight: "minimumEventHeight",
    dayStartHour: "dayStartHour",
    dayStartMinute: "dayStartMinute",
    dayEndHour: "dayEndHour",
    dayEndMinute: "dayEndMinute",
    hourSegmentTemplate: "hourSegmentTemplate",
    eventSnapSize: "eventSnapSize",
    allDayEventsLabelTemplate: "allDayEventsLabelTemplate",
    daysInWeek: "daysInWeek",
    currentTimeMarkerTemplate: "currentTimeMarkerTemplate",
    validateEventTimesChanged: "validateEventTimesChanged",
    resizeCursors: "resizeCursors"
  },
  outputs: {
    dayHeaderClicked: "dayHeaderClicked",
    eventClicked: "eventClicked",
    eventTimesChanged: "eventTimesChanged",
    beforeViewRender: "beforeViewRender",
    hourSegmentClicked: "hourSegmentClicked"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 8,
  vars: 9,
  consts: [["role", "grid", 1, "cal-week-view"], [3, "days", "locale", "customTemplate", "dayHeaderClicked", "eventDropped", "dragEnter"], ["class", "cal-all-day-events", "mwlDroppable", "", 3, "dragEnter", "dragLeave", 4, "ngIf"], ["mwlDroppable", "", 1, "cal-time-events", 3, "dragEnter", "dragLeave"], ["class", "cal-time-label-column", 4, "ngIf"], [1, "cal-day-columns"], ["dayColumns", ""], ["class", "cal-day-column", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", 1, "cal-all-day-events", 3, "dragEnter", "dragLeave"], ["allDayEventsContainer", ""], [1, "cal-time-label-column", 3, "ngTemplateOutlet"], ["class", "cal-day-column", "mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "drop", "dragEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "cal-events-row", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragOverClass", "cal-drag-over", 1, "cal-day-column", 3, "drop", "dragEnter"], [1, "cal-events-row"], ["eventRowContainer", ""], ["class", "cal-event-container", "mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "cal-draggable", "cal-starts-within-week", "cal-ends-within-week", "ngClass", "width", "marginLeft", "marginRight", "resizeCursors", "resizeSnapGrid", "validateResize", "dropData", "dragAxis", "dragSnapGrid", "validateDrag", "touchStartLongPress", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 1, "cal-event-container", 3, "ngClass", "resizeCursors", "resizeSnapGrid", "validateResize", "dropData", "dragAxis", "dragSnapGrid", "validateDrag", "touchStartLongPress", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd"], ["event", ""], ["class", "cal-resize-handle cal-resize-handle-before-start", "mwlResizeHandle", "", 3, "resizeEdges", 4, "ngIf"], [3, "locale", "weekEvent", "tooltipPlacement", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "daysInWeek", "eventClicked"], ["class", "cal-resize-handle cal-resize-handle-after-end", "mwlResizeHandle", "", 3, "resizeEdges", 4, "ngIf"], ["mwlResizeHandle", "", 1, "cal-resize-handle", "cal-resize-handle-before-start", 3, "resizeEdges"], ["mwlResizeHandle", "", 1, "cal-resize-handle", "cal-resize-handle-after-end", 3, "resizeEdges"], [1, "cal-time-label-column"], ["class", "cal-hour", 3, "cal-hour-odd", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "cal-hour"], [3, "height", "segment", "segmentHeight", "locale", "customTemplate", "isTimeLabel", "daysInWeek", 4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "segment", "segmentHeight", "locale", "customTemplate", "isTimeLabel", "daysInWeek"], [1, "cal-day-column"], [3, "columnDate", "dayStartHour", "dayStartMinute", "dayEndHour", "dayEndMinute", "hourSegments", "hourDuration", "hourSegmentHeight", "customTemplate"], [1, "cal-events-container"], ["class", "cal-event-container", "mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "cal-draggable", "cal-starts-within-day", "cal-ends-within-day", "ngClass", "hidden", "top", "height", "left", "width", "resizeCursors", "resizeSnapGrid", "validateResize", "allowNegativeResizes", "dropData", "dragAxis", "dragSnapGrid", "touchStartLongPress", "ghostDragEnabled", "ghostElementTemplate", "validateDrag", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 1, "cal-event-container", 3, "ngClass", "hidden", "resizeCursors", "resizeSnapGrid", "validateResize", "allowNegativeResizes", "dropData", "dragAxis", "dragSnapGrid", "touchStartLongPress", "ghostDragEnabled", "ghostElementTemplate", "validateDrag", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd"], [3, "ngTemplateOutlet"], ["weekEventTemplate", ""], [3, "locale", "weekEvent", "tooltipPlacement", "tooltipTemplate", "tooltipAppendToBody", "tooltipDisabled", "tooltipDelay", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "column", "daysInWeek", "eventClicked"], ["mwlDroppable", "", "dragActiveClass", "cal-drag-active", 3, "height", "segment", "segmentHeight", "locale", "customTemplate", "daysInWeek", "clickListenerDisabled", "dragOverClass", "isTimeLabel", "mwlClick", "drop", "dragEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragActiveClass", "cal-drag-active", 3, "segment", "segmentHeight", "locale", "customTemplate", "daysInWeek", "clickListenerDisabled", "dragOverClass", "isTimeLabel", "mwlClick", "drop", "dragEnter"]],
  template: function CalendarWeekViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "mwl-calendar-week-view-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dayHeaderClicked", function CalendarWeekViewComponent_Template_mwl_calendar_week_view_header_dayHeaderClicked_1_listener($event) {
        return ctx.dayHeaderClicked.emit($event);
      })("eventDropped", function CalendarWeekViewComponent_Template_mwl_calendar_week_view_header_eventDropped_1_listener($event) {
        return ctx.eventDropped({
          dropData: $event
        }, $event.newStart, true);
      })("dragEnter", function CalendarWeekViewComponent_Template_mwl_calendar_week_view_header_dragEnter_1_listener($event) {
        return ctx.dateDragEnter($event.date);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_2_Template, 6, 5, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dragEnter", function CalendarWeekViewComponent_Template_div_dragEnter_3_listener() {
        return ctx.dragEnter("time");
      })("dragLeave", function CalendarWeekViewComponent_Template_div_dragLeave_3_listener() {
        return ctx.dragLeave("time");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_4_Template, 2, 2, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 5, 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, CalendarWeekViewComponent_div_7_Template, 5, 13, "div", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("days", ctx.days)("locale", ctx.locale)("customTemplate", ctx.headerTemplate);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.view.allDayEventRows.length > 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.view.hourColumns.length > 0 && ctx.daysInWeek !== 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-resize-active", ctx.timeEventResizes.size > 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.view.hourColumns)("ngForTrackBy", ctx.trackByHourColumn);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableDirective, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizeHandleDirective, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DraggableDirective, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DroppableDirective, ClickDirective, CalendarWeekViewHeaderComponent, CalendarWeekViewEventComponent, CalendarWeekViewHourSegmentComponent, CalendarWeekViewCurrentTimeMarkerComponent],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view',
      template: `
    <div class="cal-week-view" role="grid">
      <mwl-calendar-week-view-header
        [days]="days"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (dayHeaderClicked)="dayHeaderClicked.emit($event)"
        (eventDropped)="
          eventDropped({ dropData: $event }, $event.newStart, true)
        "
        (dragEnter)="dateDragEnter($event.date)"
      >
      </mwl-calendar-week-view-header>
      <div
        class="cal-all-day-events"
        #allDayEventsContainer
        *ngIf="view.allDayEventRows.length > 0"
        mwlDroppable
        (dragEnter)="dragEnter('allDay')"
        (dragLeave)="dragLeave('allDay')"
      >
        <div class="cal-day-columns">
          <div
            class="cal-time-label-column"
            [ngTemplateOutlet]="allDayEventsLabelTemplate"
          ></div>
          <div
            class="cal-day-column"
            *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="eventDropped($event, day.date, true)"
            (dragEnter)="dateDragEnter(day.date)"
          ></div>
        </div>
        <div
          *ngFor="let eventRow of view.allDayEventRows; trackBy: trackById"
          #eventRowContainer
          class="cal-events-row"
        >
          <div
            *ngFor="
              let allDayEvent of eventRow.row;
              trackBy: trackByWeekAllDayEvent
            "
            #event
            class="cal-event-container"
            [class.cal-draggable]="
              allDayEvent.event.draggable && allDayEventResizes.size === 0
            "
            [class.cal-starts-within-week]="!allDayEvent.startsBeforeWeek"
            [class.cal-ends-within-week]="!allDayEvent.endsAfterWeek"
            [ngClass]="allDayEvent.event?.cssClass"
            [style.width.%]="(100 / days.length) * allDayEvent.span"
            [style.marginLeft.%]="
              rtl ? null : (100 / days.length) * allDayEvent.offset
            "
            [style.marginRight.%]="
              rtl ? (100 / days.length) * allDayEvent.offset : null
            "
            mwlResizable
            [resizeCursors]="resizeCursors"
            [resizeSnapGrid]="{ left: dayColumnWidth, right: dayColumnWidth }"
            [validateResize]="validateResize"
            (resizeStart)="
              allDayEventResizeStarted(eventRowContainer, allDayEvent, $event)
            "
            (resizing)="
              allDayEventResizing(allDayEvent, $event, dayColumnWidth)
            "
            (resizeEnd)="allDayEventResizeEnded(allDayEvent)"
            mwlDraggable
            dragActiveClass="cal-drag-active"
            [dropData]="{ event: allDayEvent.event, calendarId: calendarId }"
            [dragAxis]="{
              x: allDayEvent.event.draggable && allDayEventResizes.size === 0,
              y:
                !snapDraggedEvents &&
                allDayEvent.event.draggable &&
                allDayEventResizes.size === 0
            }"
            [dragSnapGrid]="snapDraggedEvents ? { x: dayColumnWidth } : {}"
            [validateDrag]="validateDrag"
            [touchStartLongPress]="{ delay: 300, delta: 30 }"
            (dragStart)="
              dragStarted(eventRowContainer, event, allDayEvent, false)
            "
            (dragging)="allDayEventDragMove()"
            (dragEnd)="dragEnded(allDayEvent, $event, dayColumnWidth)"
          >
            <div
              class="cal-resize-handle cal-resize-handle-before-start"
              *ngIf="
                allDayEvent.event?.resizable?.beforeStart &&
                !allDayEvent.startsBeforeWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ left: true }"
            ></div>
            <mwl-calendar-week-view-event
              [locale]="locale"
              [weekEvent]="allDayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="eventTemplate"
              [eventTitleTemplate]="eventTitleTemplate"
              [eventActionsTemplate]="eventActionsTemplate"
              [daysInWeek]="daysInWeek"
              (eventClicked)="
                eventClicked.emit({
                  event: allDayEvent.event,
                  sourceEvent: $event.sourceEvent
                })
              "
            >
            </mwl-calendar-week-view-event>
            <div
              class="cal-resize-handle cal-resize-handle-after-end"
              *ngIf="
                allDayEvent.event?.resizable?.afterEnd &&
                !allDayEvent.endsAfterWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ right: true }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="cal-time-events"
        mwlDroppable
        (dragEnter)="dragEnter('time')"
        (dragLeave)="dragLeave('time')"
      >
        <div
          class="cal-time-label-column"
          *ngIf="view.hourColumns.length > 0 && daysInWeek !== 1"
        >
          <div
            *ngFor="
              let hour of view.hourColumns[0].hours;
              trackBy: trackByHour;
              let odd = odd
            "
            class="cal-hour"
            [class.cal-hour-odd]="odd"
          >
            <mwl-calendar-week-view-hour-segment
              *ngFor="let segment of hour.segments; trackBy: trackByHourSegment"
              [style.height.px]="hourSegmentHeight"
              [segment]="segment"
              [segmentHeight]="hourSegmentHeight"
              [locale]="locale"
              [customTemplate]="hourSegmentTemplate"
              [isTimeLabel]="true"
              [daysInWeek]="daysInWeek"
            >
            </mwl-calendar-week-view-hour-segment>
          </div>
        </div>
        <div
          class="cal-day-columns"
          [class.cal-resize-active]="timeEventResizes.size > 0"
          #dayColumns
        >
          <div
            class="cal-day-column"
            *ngFor="let column of view.hourColumns; trackBy: trackByHourColumn"
          >
            <mwl-calendar-week-view-current-time-marker
              [columnDate]="column.date"
              [dayStartHour]="dayStartHour"
              [dayStartMinute]="dayStartMinute"
              [dayEndHour]="dayEndHour"
              [dayEndMinute]="dayEndMinute"
              [hourSegments]="hourSegments"
              [hourDuration]="hourDuration"
              [hourSegmentHeight]="hourSegmentHeight"
              [customTemplate]="currentTimeMarkerTemplate"
            ></mwl-calendar-week-view-current-time-marker>
            <div class="cal-events-container">
              <div
                *ngFor="
                  let timeEvent of column.events;
                  trackBy: trackByWeekTimeEvent
                "
                #event
                class="cal-event-container"
                [class.cal-draggable]="
                  timeEvent.event.draggable && timeEventResizes.size === 0
                "
                [class.cal-starts-within-day]="!timeEvent.startsBeforeDay"
                [class.cal-ends-within-day]="!timeEvent.endsAfterDay"
                [ngClass]="timeEvent.event.cssClass"
                [hidden]="timeEvent.height === 0 && timeEvent.width === 0"
                [style.top.px]="timeEvent.top"
                [style.height.px]="timeEvent.height"
                [style.left.%]="timeEvent.left"
                [style.width.%]="timeEvent.width"
                mwlResizable
                [resizeCursors]="resizeCursors"
                [resizeSnapGrid]="{
                  left: dayColumnWidth,
                  right: dayColumnWidth,
                  top: eventSnapSize || hourSegmentHeight,
                  bottom: eventSnapSize || hourSegmentHeight
                }"
                [validateResize]="validateResize"
                [allowNegativeResizes]="true"
                (resizeStart)="
                  timeEventResizeStarted(dayColumns, timeEvent, $event)
                "
                (resizing)="timeEventResizing(timeEvent, $event)"
                (resizeEnd)="timeEventResizeEnded(timeEvent)"
                mwlDraggable
                dragActiveClass="cal-drag-active"
                [dropData]="{ event: timeEvent.event, calendarId: calendarId }"
                [dragAxis]="{
                  x: timeEvent.event.draggable && timeEventResizes.size === 0,
                  y: timeEvent.event.draggable && timeEventResizes.size === 0
                }"
                [dragSnapGrid]="
                  snapDraggedEvents
                    ? {
                        x: dayColumnWidth,
                        y: eventSnapSize || hourSegmentHeight
                      }
                    : {}
                "
                [touchStartLongPress]="{ delay: 300, delta: 30 }"
                [ghostDragEnabled]="!snapDraggedEvents"
                [ghostElementTemplate]="weekEventTemplate"
                [validateDrag]="validateDrag"
                (dragStart)="dragStarted(dayColumns, event, timeEvent, true)"
                (dragging)="dragMove(timeEvent, $event)"
                (dragEnd)="dragEnded(timeEvent, $event, dayColumnWidth, true)"
              >
                <div
                  class="cal-resize-handle cal-resize-handle-before-start"
                  *ngIf="
                    timeEvent.event?.resizable?.beforeStart &&
                    !timeEvent.startsBeforeDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    left: true,
                    top: true
                  }"
                ></div>
                <ng-template
                  [ngTemplateOutlet]="weekEventTemplate"
                ></ng-template>
                <ng-template #weekEventTemplate>
                  <mwl-calendar-week-view-event
                    [locale]="locale"
                    [weekEvent]="timeEvent"
                    [tooltipPlacement]="tooltipPlacement"
                    [tooltipTemplate]="tooltipTemplate"
                    [tooltipAppendToBody]="tooltipAppendToBody"
                    [tooltipDisabled]="dragActive || timeEventResizes.size > 0"
                    [tooltipDelay]="tooltipDelay"
                    [customTemplate]="eventTemplate"
                    [eventTitleTemplate]="eventTitleTemplate"
                    [eventActionsTemplate]="eventActionsTemplate"
                    [column]="column"
                    [daysInWeek]="daysInWeek"
                    (eventClicked)="
                      eventClicked.emit({
                        event: timeEvent.event,
                        sourceEvent: $event.sourceEvent
                      })
                    "
                  >
                  </mwl-calendar-week-view-event>
                </ng-template>
                <div
                  class="cal-resize-handle cal-resize-handle-after-end"
                  *ngIf="
                    timeEvent.event?.resizable?.afterEnd &&
                    !timeEvent.endsAfterDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    right: true,
                    bottom: true
                  }"
                ></div>
              </div>
            </div>

            <div
              *ngFor="
                let hour of column.hours;
                trackBy: trackByHour;
                let odd = odd
              "
              class="cal-hour"
              [class.cal-hour-odd]="odd"
            >
              <mwl-calendar-week-view-hour-segment
                *ngFor="
                  let segment of hour.segments;
                  trackBy: trackByHourSegment
                "
                [style.height.px]="hourSegmentHeight"
                [segment]="segment"
                [segmentHeight]="hourSegmentHeight"
                [locale]="locale"
                [customTemplate]="hourSegmentTemplate"
                [daysInWeek]="daysInWeek"
                (mwlClick)="
                  hourSegmentClicked.emit({
                    date: segment.date,
                    sourceEvent: $event
                  })
                "
                [clickListenerDisabled]="
                  hourSegmentClicked.observers.length === 0
                "
                mwlDroppable
                [dragOverClass]="
                  !dragActive || !snapDraggedEvents ? 'cal-drag-over' : null
                "
                dragActiveClass="cal-drag-active"
                (drop)="eventDropped($event, segment.date, false)"
                (dragEnter)="dateDragEnter(segment.date)"
                [isTimeLabel]="daysInWeek === 1"
              >
              </mwl-calendar-week-view-hour-segment>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef
    }, {
      type: CalendarUtils
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }, {
      type: DateAdapter
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }];
  }, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    refresh: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekStartsOn: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    headerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    precision: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekendDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    snapDraggedEvents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegments: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourDuration: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    minimumEventHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventSnapSize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    allDayEventsLabelTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    currentTimeMarkerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateEventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    resizeCursors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    beforeViewRender: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    hourSegmentClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarWeekModule {}
CalendarWeekModule.ɵfac = function CalendarWeekModule_Factory(t) {
  return new (t || CalendarWeekModule)();
};
CalendarWeekModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarWeekModule
});
CalendarWeekModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule],
      declarations: [CalendarWeekViewComponent, CalendarWeekViewHeaderComponent, CalendarWeekViewEventComponent, CalendarWeekViewHourSegmentComponent, CalendarWeekViewCurrentTimeMarkerComponent],
      exports: [angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarWeekViewComponent, CalendarWeekViewHeaderComponent, CalendarWeekViewEventComponent, CalendarWeekViewHourSegmentComponent, CalendarWeekViewCurrentTimeMarkerComponent]
    }]
  }], null, null);
})();

/**
 * Shows all events on a given day. Example usage:
 *
 * ```typescript
 * <mwl-calendar-day-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-day-view>
 * ```
 */
class CalendarDayViewComponent {
  constructor() {
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    this.events = [];
    /**
     * The number of segments in an hour. Must divide equally into 60.
     */
    this.hourSegments = 2;
    /**
     * The height in pixels of each hour segment
     */
    this.hourSegmentHeight = 30;
    /**
     * The minimum height in pixels of each event
     */
    this.minimumEventHeight = 30;
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    this.dayStartHour = 0;
    /**
     * The day start minutes. Must be 0-59
     */
    this.dayStartMinute = 0;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    this.dayEndHour = 23;
    /**
     * The day end minutes. Must be 0-59
     */
    this.dayEndMinute = 59;
    /**
     * The placement of the event tooltip
     */
    this.tooltipPlacement = 'auto';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = true;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = null;
    /**
     * Whether to snap events to a grid when dragging
     */
    this.snapDraggedEvents = true;
    /**
     * Called when an event title is clicked
     */
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an hour segment is clicked
     */
    this.hourSegmentClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event is resized or dragged and dropped
     */
    this.eventTimesChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * An output that will be called before the view is rendered for the current day.
     * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
     */
    this.beforeViewRender = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
}
CalendarDayViewComponent.ɵfac = function CalendarDayViewComponent_Factory(t) {
  return new (t || CalendarDayViewComponent)();
};
CalendarDayViewComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarDayViewComponent,
  selectors: [["mwl-calendar-day-view"]],
  inputs: {
    viewDate: "viewDate",
    events: "events",
    hourSegments: "hourSegments",
    hourSegmentHeight: "hourSegmentHeight",
    hourDuration: "hourDuration",
    minimumEventHeight: "minimumEventHeight",
    dayStartHour: "dayStartHour",
    dayStartMinute: "dayStartMinute",
    dayEndHour: "dayEndHour",
    dayEndMinute: "dayEndMinute",
    refresh: "refresh",
    locale: "locale",
    eventSnapSize: "eventSnapSize",
    tooltipPlacement: "tooltipPlacement",
    tooltipTemplate: "tooltipTemplate",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDelay: "tooltipDelay",
    hourSegmentTemplate: "hourSegmentTemplate",
    eventTemplate: "eventTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    snapDraggedEvents: "snapDraggedEvents",
    allDayEventsLabelTemplate: "allDayEventsLabelTemplate",
    currentTimeMarkerTemplate: "currentTimeMarkerTemplate",
    validateEventTimesChanged: "validateEventTimesChanged",
    resizeCursors: "resizeCursors"
  },
  outputs: {
    eventClicked: "eventClicked",
    hourSegmentClicked: "hourSegmentClicked",
    eventTimesChanged: "eventTimesChanged",
    beforeViewRender: "beforeViewRender"
  },
  decls: 1,
  vars: 27,
  consts: [[1, "cal-day-view", 3, "daysInWeek", "viewDate", "events", "hourSegments", "hourDuration", "hourSegmentHeight", "minimumEventHeight", "dayStartHour", "dayStartMinute", "dayEndHour", "dayEndMinute", "refresh", "locale", "eventSnapSize", "tooltipPlacement", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "resizeCursors", "hourSegmentTemplate", "eventTemplate", "eventTitleTemplate", "eventActionsTemplate", "snapDraggedEvents", "allDayEventsLabelTemplate", "currentTimeMarkerTemplate", "validateEventTimesChanged", "eventClicked", "hourSegmentClicked", "eventTimesChanged", "beforeViewRender"]],
  template: function CalendarDayViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarDayViewComponent_Template_mwl_calendar_week_view_eventClicked_0_listener($event) {
        return ctx.eventClicked.emit($event);
      })("hourSegmentClicked", function CalendarDayViewComponent_Template_mwl_calendar_week_view_hourSegmentClicked_0_listener($event) {
        return ctx.hourSegmentClicked.emit($event);
      })("eventTimesChanged", function CalendarDayViewComponent_Template_mwl_calendar_week_view_eventTimesChanged_0_listener($event) {
        return ctx.eventTimesChanged.emit($event);
      })("beforeViewRender", function CalendarDayViewComponent_Template_mwl_calendar_week_view_beforeViewRender_0_listener($event) {
        return ctx.beforeViewRender.emit($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("daysInWeek", 1)("viewDate", ctx.viewDate)("events", ctx.events)("hourSegments", ctx.hourSegments)("hourDuration", ctx.hourDuration)("hourSegmentHeight", ctx.hourSegmentHeight)("minimumEventHeight", ctx.minimumEventHeight)("dayStartHour", ctx.dayStartHour)("dayStartMinute", ctx.dayStartMinute)("dayEndHour", ctx.dayEndHour)("dayEndMinute", ctx.dayEndMinute)("refresh", ctx.refresh)("locale", ctx.locale)("eventSnapSize", ctx.eventSnapSize)("tooltipPlacement", ctx.tooltipPlacement)("tooltipTemplate", ctx.tooltipTemplate)("tooltipAppendToBody", ctx.tooltipAppendToBody)("tooltipDelay", ctx.tooltipDelay)("resizeCursors", ctx.resizeCursors)("hourSegmentTemplate", ctx.hourSegmentTemplate)("eventTemplate", ctx.eventTemplate)("eventTitleTemplate", ctx.eventTitleTemplate)("eventActionsTemplate", ctx.eventActionsTemplate)("snapDraggedEvents", ctx.snapDraggedEvents)("allDayEventsLabelTemplate", ctx.allDayEventsLabelTemplate)("currentTimeMarkerTemplate", ctx.currentTimeMarkerTemplate)("validateEventTimesChanged", ctx.validateEventTimesChanged);
    }
  },
  dependencies: [CalendarWeekViewComponent],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDayViewComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-day-view',
      template: `
    <mwl-calendar-week-view
      class="cal-day-view"
      [daysInWeek]="1"
      [viewDate]="viewDate"
      [events]="events"
      [hourSegments]="hourSegments"
      [hourDuration]="hourDuration"
      [hourSegmentHeight]="hourSegmentHeight"
      [minimumEventHeight]="minimumEventHeight"
      [dayStartHour]="dayStartHour"
      [dayStartMinute]="dayStartMinute"
      [dayEndHour]="dayEndHour"
      [dayEndMinute]="dayEndMinute"
      [refresh]="refresh"
      [locale]="locale"
      [eventSnapSize]="eventSnapSize"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipAppendToBody]="tooltipAppendToBody"
      [tooltipDelay]="tooltipDelay"
      [resizeCursors]="resizeCursors"
      [hourSegmentTemplate]="hourSegmentTemplate"
      [eventTemplate]="eventTemplate"
      [eventTitleTemplate]="eventTitleTemplate"
      [eventActionsTemplate]="eventActionsTemplate"
      [snapDraggedEvents]="snapDraggedEvents"
      [allDayEventsLabelTemplate]="allDayEventsLabelTemplate"
      [currentTimeMarkerTemplate]="currentTimeMarkerTemplate"
      [validateEventTimesChanged]="validateEventTimesChanged"
      (eventClicked)="eventClicked.emit($event)"
      (hourSegmentClicked)="hourSegmentClicked.emit($event)"
      (eventTimesChanged)="eventTimesChanged.emit($event)"
      (beforeViewRender)="beforeViewRender.emit($event)"
    ></mwl-calendar-week-view>
  `
    }]
  }], null, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegments: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourDuration: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    minimumEventHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    refresh: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventSnapSize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    snapDraggedEvents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    allDayEventsLabelTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    currentTimeMarkerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateEventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    resizeCursors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    hourSegmentClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    beforeViewRender: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarDayModule {}
CalendarDayModule.ɵfac = function CalendarDayModule_Factory(t) {
  return new (t || CalendarDayModule)();
};
CalendarDayModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarDayModule
});
CalendarDayModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, CalendarCommonModule, CalendarWeekModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDayModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, CalendarCommonModule, CalendarWeekModule],
      declarations: [CalendarDayViewComponent],
      exports: [CalendarDayViewComponent]
    }]
  }], null, null);
})();

/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
class CalendarModule {
  static forRoot(dateAdapter, config = {}) {
    return {
      ngModule: CalendarModule,
      providers: [dateAdapter, config.eventTitleFormatter || CalendarEventTitleFormatter, config.dateFormatter || CalendarDateFormatter, config.utils || CalendarUtils, config.a11y || CalendarA11y]
    };
  }
}
CalendarModule.ɵfac = function CalendarModule_Factory(t) {
  return new (t || CalendarModule)();
};
CalendarModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarModule
});
CalendarModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule, CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule],
      exports: [CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule]
    }]
  }], null, null);
})();

/*
 * Public API Surface of angular-calendar
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-calendar.mjs.map

/***/ }),

/***/ 60624:
/*!*******************************************************************************************!*\
  !*** ./node_modules/angular-draggable-droppable/fesm2020/angular-draggable-droppable.mjs ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragAndDropModule: () => (/* binding */ DragAndDropModule),
/* harmony export */   DraggableDirective: () => (/* binding */ DraggableDirective),
/* harmony export */   DraggableScrollContainerDirective: () => (/* binding */ DraggableScrollContainerDirective),
/* harmony export */   DroppableDirective: () => (/* binding */ DroppableDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 12235);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 55400);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 7835);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 33839);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 59016);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 72607);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 85584);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 20274);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 81527);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 17344);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 82053);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 99422);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs/operators */ 53317);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _mattlewis92_dom_autoscroller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mattlewis92/dom-autoscroller */ 40702);






function addClass(renderer, element, classToAdd) {
  if (classToAdd) {
    classToAdd.split(' ').forEach(className => renderer.addClass(element.nativeElement, className));
  }
}
function removeClass(renderer, element, classToRemove) {
  if (classToRemove) {
    classToRemove.split(' ').forEach(className => renderer.removeClass(element.nativeElement, className));
  }
}
class DraggableHelper {
  constructor() {
    this.currentDrag = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  }
}
DraggableHelper.ɵfac = function DraggableHelper_Factory(t) {
  return new (t || DraggableHelper)();
};
DraggableHelper.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: DraggableHelper,
  factory: DraggableHelper.ɵfac,
  providedIn: 'root'
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DraggableHelper, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable,
    args: [{
      providedIn: 'root'
    }]
  }], null, null);
})();

/**
 * If the window isn't scrollable, then place this on the scrollable container that draggable elements are inside. e.g.
 * ```html
  <div style="overflow: scroll" mwlDraggableScrollContainer>
    <div mwlDraggable>Drag me!</div>
  </div>
  ```
 */
class DraggableScrollContainerDirective {
  /**
   * @hidden
   */
  constructor(elementRef) {
    this.elementRef = elementRef;
  }
}
DraggableScrollContainerDirective.ɵfac = function DraggableScrollContainerDirective_Factory(t) {
  return new (t || DraggableScrollContainerDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef));
};
DraggableScrollContainerDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: DraggableScrollContainerDirective,
  selectors: [["", "mwlDraggableScrollContainer", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DraggableScrollContainerDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlDraggableScrollContainer]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }];
  }, null);
})();
class DraggableDirective {
  /**
   * @hidden
   */
  constructor(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
    this.element = element;
    this.renderer = renderer;
    this.draggableHelper = draggableHelper;
    this.zone = zone;
    this.vcr = vcr;
    this.scrollContainer = scrollContainer;
    this.document = document;
    /**
     * The axis along which the element is draggable
     */
    this.dragAxis = {
      x: true,
      y: true
    };
    /**
     * Snap all drags to an x / y grid
     */
    this.dragSnapGrid = {};
    /**
     * Show a ghost element that shows the drag when dragging
     */
    this.ghostDragEnabled = true;
    /**
     * Show the original element when ghostDragEnabled is true
     */
    this.showOriginalElementWhileDragging = false;
    /**
     * The cursor to use when hovering over a draggable element
     */
    this.dragCursor = '';
    /*
     * Options used to control the behaviour of auto scrolling: https://www.npmjs.com/package/dom-autoscroller
     */
    this.autoScroll = {
      margin: 20
    };
    /**
     * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
     */
    this.dragPointerDown = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the element has started to be dragged.
     * Only called after at least one mouse or touch move event.
     * If you call $event.cancelDrag$.emit() it will cancel the current drag
     */
    this.dragStart = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called after the ghost element has been created
     */
    this.ghostElementCreated = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the element is being dragged
     */
    this.dragging = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called after the element is dragged
     */
    this.dragEnd = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * @hidden
     */
    this.pointerDown$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.pointerMove$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.pointerUp$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.eventListenerSubscriptions = {};
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.timeLongPress = {
      timerBegin: 0,
      timerEnd: 0
    };
  }
  ngOnInit() {
    this.checkEventListeners();
    const pointerDragged$ = this.pointerDown$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(() => this.canDrag()), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.mergeMap)(pointerDownEvent => {
      // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
      // stop mouse events propagating up the chain
      if (pointerDownEvent.event.stopPropagation && !this.scrollContainer) {
        pointerDownEvent.event.stopPropagation();
      }
      // hack to prevent text getting selected in safari while dragging
      const globalDragStyle = this.renderer.createElement('style');
      this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
      this.renderer.appendChild(globalDragStyle, this.renderer.createText(`
          body * {
           -moz-user-select: none;
           -ms-user-select: none;
           -webkit-user-select: none;
           user-select: none;
          }
        `));
      requestAnimationFrame(() => {
        this.document.head.appendChild(globalDragStyle);
      });
      const startScrollPosition = this.getScrollPosition();
      const scrollContainerScroll$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Observable(observer => {
        const scrollContainer = this.scrollContainer ? this.scrollContainer.elementRef.nativeElement : 'window';
        return this.renderer.listen(scrollContainer, 'scroll', e => observer.next(e));
      }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.startWith)(startScrollPosition), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(() => this.getScrollPosition()));
      const currentDrag$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
      const cancelDrag$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__.ReplaySubject();
      if (this.dragPointerDown.observers.length > 0) {
        this.zone.run(() => {
          this.dragPointerDown.next({
            x: 0,
            y: 0
          });
        });
      }
      const dragComplete$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(this.pointerUp$, this.pointerDown$, cancelDrag$, this.destroy$).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      const pointerMove = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.pointerMove$, scrollContainerScroll$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([pointerMoveEvent, scroll]) => {
        return {
          currentDrag$,
          transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
          transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
          clientX: pointerMoveEvent.clientX,
          clientY: pointerMoveEvent.clientY,
          scrollLeft: scroll.left,
          scrollTop: scroll.top,
          target: pointerMoveEvent.event.target
        };
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(moveData => {
        if (this.dragSnapGrid.x) {
          moveData.transformX = Math.round(moveData.transformX / this.dragSnapGrid.x) * this.dragSnapGrid.x;
        }
        if (this.dragSnapGrid.y) {
          moveData.transformY = Math.round(moveData.transformY / this.dragSnapGrid.y) * this.dragSnapGrid.y;
        }
        return moveData;
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(moveData => {
        if (!this.dragAxis.x) {
          moveData.transformX = 0;
        }
        if (!this.dragAxis.y) {
          moveData.transformY = 0;
        }
        return moveData;
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(moveData => {
        const scrollX = moveData.scrollLeft - startScrollPosition.left;
        const scrollY = moveData.scrollTop - startScrollPosition.top;
        return {
          ...moveData,
          x: moveData.transformX + scrollX,
          y: moveData.transformY + scrollY
        };
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(({
        x,
        y,
        transformX,
        transformY
      }) => !this.validateDrag || this.validateDrag({
        x,
        y,
        transform: {
          x: transformX,
          y: transformY
        }
      })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(dragComplete$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      const dragStarted$ = pointerMove.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      const dragEnded$ = pointerMove.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.takeLast)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      dragStarted$.subscribe(({
        clientX,
        clientY,
        x,
        y
      }) => {
        if (this.dragStart.observers.length > 0) {
          this.zone.run(() => {
            this.dragStart.next({
              cancelDrag$
            });
          });
        }
        this.scroller = (0,_mattlewis92_dom_autoscroller__WEBPACK_IMPORTED_MODULE_0__["default"])([this.scrollContainer ? this.scrollContainer.elementRef.nativeElement : this.document.defaultView], {
          ...this.autoScroll,
          autoScroll() {
            return true;
          }
        });
        addClass(this.renderer, this.element, this.dragActiveClass);
        if (this.ghostDragEnabled) {
          const rect = this.element.nativeElement.getBoundingClientRect();
          const clone = this.element.nativeElement.cloneNode(true);
          if (!this.showOriginalElementWhileDragging) {
            this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
          }
          if (this.ghostElementAppendTo) {
            this.ghostElementAppendTo.appendChild(clone);
          } else {
            this.element.nativeElement.parentNode.insertBefore(clone, this.element.nativeElement.nextSibling);
          }
          this.ghostElement = clone;
          this.document.body.style.cursor = this.dragCursor;
          this.setElementStyles(clone, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            cursor: this.dragCursor,
            margin: '0',
            willChange: 'transform',
            pointerEvents: 'none'
          });
          if (this.ghostElementTemplate) {
            const viewRef = this.vcr.createEmbeddedView(this.ghostElementTemplate);
            clone.innerHTML = '';
            viewRef.rootNodes.filter(node => node instanceof Node).forEach(node => {
              clone.appendChild(node);
            });
            dragEnded$.subscribe(() => {
              this.vcr.remove(this.vcr.indexOf(viewRef));
            });
          }
          if (this.ghostElementCreated.observers.length > 0) {
            this.zone.run(() => {
              this.ghostElementCreated.emit({
                clientX: clientX - x,
                clientY: clientY - y,
                element: clone
              });
            });
          }
          dragEnded$.subscribe(() => {
            clone.parentElement.removeChild(clone);
            this.ghostElement = null;
            this.renderer.setStyle(this.element.nativeElement, 'visibility', '');
          });
        }
        this.draggableHelper.currentDrag.next(currentDrag$);
      });
      dragEnded$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.mergeMap)(dragEndData => {
        const dragEndData$ = cancelDrag$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.count)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(calledCount => ({
          ...dragEndData,
          dragCancelled: calledCount > 0
        })));
        cancelDrag$.complete();
        return dragEndData$;
      })).subscribe(({
        x,
        y,
        dragCancelled
      }) => {
        this.scroller.destroy();
        if (this.dragEnd.observers.length > 0) {
          this.zone.run(() => {
            this.dragEnd.next({
              x,
              y,
              dragCancelled
            });
          });
        }
        removeClass(this.renderer, this.element, this.dragActiveClass);
        currentDrag$.complete();
      });
      (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(dragComplete$, dragEnded$).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1)).subscribe(() => {
        requestAnimationFrame(() => {
          this.document.head.removeChild(globalDragStyle);
        });
      });
      return pointerMove;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
    (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(pointerDragged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(value => [, value])), pointerDragged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.pairwise)())).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(([previous, next]) => {
      if (!previous) {
        return true;
      }
      return previous.x !== next.x || previous.y !== next.y;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([previous, next]) => next)).subscribe(({
      x,
      y,
      currentDrag$,
      clientX,
      clientY,
      transformX,
      transformY,
      target
    }) => {
      if (this.dragging.observers.length > 0) {
        this.zone.run(() => {
          this.dragging.next({
            x,
            y
          });
        });
      }
      requestAnimationFrame(() => {
        if (this.ghostElement) {
          const transform = `translate3d(${transformX}px, ${transformY}px, 0px)`;
          this.setElementStyles(this.ghostElement, {
            transform,
            '-webkit-transform': transform,
            '-ms-transform': transform,
            '-moz-transform': transform,
            '-o-transform': transform
          });
        }
      });
      currentDrag$.next({
        clientX,
        clientY,
        dropData: this.dropData,
        target
      });
    });
  }
  ngOnChanges(changes) {
    if (changes.dragAxis) {
      this.checkEventListeners();
    }
  }
  ngOnDestroy() {
    this.unsubscribeEventListeners();
    this.pointerDown$.complete();
    this.pointerMove$.complete();
    this.pointerUp$.complete();
    this.destroy$.next();
  }
  checkEventListeners() {
    const canDrag = this.canDrag();
    const hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
    if (canDrag && !hasEventListeners) {
      this.zone.runOutsideAngular(() => {
        this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement, 'mousedown', event => {
          this.onMouseDown(event);
        });
        this.eventListenerSubscriptions.mouseup = this.renderer.listen('document', 'mouseup', event => {
          this.onMouseUp(event);
        });
        this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement, 'touchstart', event => {
          this.onTouchStart(event);
        });
        this.eventListenerSubscriptions.touchend = this.renderer.listen('document', 'touchend', event => {
          this.onTouchEnd(event);
        });
        this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document', 'touchcancel', event => {
          this.onTouchEnd(event);
        });
        this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement, 'mouseenter', () => {
          this.onMouseEnter();
        });
        this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement, 'mouseleave', () => {
          this.onMouseLeave();
        });
      });
    } else if (!canDrag && hasEventListeners) {
      this.unsubscribeEventListeners();
    }
  }
  onMouseDown(event) {
    if (event.button === 0) {
      if (!this.eventListenerSubscriptions.mousemove) {
        this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', mouseMoveEvent => {
          this.pointerMove$.next({
            event: mouseMoveEvent,
            clientX: mouseMoveEvent.clientX,
            clientY: mouseMoveEvent.clientY
          });
        });
      }
      this.pointerDown$.next({
        event,
        clientX: event.clientX,
        clientY: event.clientY
      });
    }
  }
  onMouseUp(event) {
    if (event.button === 0) {
      if (this.eventListenerSubscriptions.mousemove) {
        this.eventListenerSubscriptions.mousemove();
        delete this.eventListenerSubscriptions.mousemove;
      }
      this.pointerUp$.next({
        event,
        clientX: event.clientX,
        clientY: event.clientY
      });
    }
  }
  onTouchStart(event) {
    let startScrollPosition;
    let isDragActivated;
    let hasContainerScrollbar;
    if (this.touchStartLongPress) {
      this.timeLongPress.timerBegin = Date.now();
      isDragActivated = false;
      hasContainerScrollbar = this.hasScrollbar();
      startScrollPosition = this.getScrollPosition();
    }
    if (!this.eventListenerSubscriptions.touchmove) {
      const contextMenuListener = (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.fromEvent)(this.document, 'contextmenu').subscribe(e => {
        e.preventDefault();
      });
      const touchMoveListener = (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.fromEvent)(this.document, 'touchmove', {
        passive: false
      }).subscribe(touchMoveEvent => {
        if (this.touchStartLongPress && !isDragActivated && hasContainerScrollbar) {
          isDragActivated = this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
        }
        if (!this.touchStartLongPress || !hasContainerScrollbar || isDragActivated) {
          touchMoveEvent.preventDefault();
          this.pointerMove$.next({
            event: touchMoveEvent,
            clientX: touchMoveEvent.targetTouches[0].clientX,
            clientY: touchMoveEvent.targetTouches[0].clientY
          });
        }
      });
      this.eventListenerSubscriptions.touchmove = () => {
        contextMenuListener.unsubscribe();
        touchMoveListener.unsubscribe();
      };
    }
    this.pointerDown$.next({
      event,
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY
    });
  }
  onTouchEnd(event) {
    if (this.eventListenerSubscriptions.touchmove) {
      this.eventListenerSubscriptions.touchmove();
      delete this.eventListenerSubscriptions.touchmove;
      if (this.touchStartLongPress) {
        this.enableScroll();
      }
    }
    this.pointerUp$.next({
      event,
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY
    });
  }
  onMouseEnter() {
    this.setCursor(this.dragCursor);
  }
  onMouseLeave() {
    this.setCursor('');
  }
  canDrag() {
    return this.dragAxis.x || this.dragAxis.y;
  }
  setCursor(value) {
    if (!this.eventListenerSubscriptions.mousemove) {
      this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
    }
  }
  unsubscribeEventListeners() {
    Object.keys(this.eventListenerSubscriptions).forEach(type => {
      this.eventListenerSubscriptions[type]();
      delete this.eventListenerSubscriptions[type];
    });
  }
  setElementStyles(element, styles) {
    Object.keys(styles).forEach(key => {
      this.renderer.setStyle(element, key, styles[key]);
    });
  }
  getScrollElement() {
    if (this.scrollContainer) {
      return this.scrollContainer.elementRef.nativeElement;
    } else {
      return this.document.body;
    }
  }
  getScrollPosition() {
    if (this.scrollContainer) {
      return {
        top: this.scrollContainer.elementRef.nativeElement.scrollTop,
        left: this.scrollContainer.elementRef.nativeElement.scrollLeft
      };
    } else {
      return {
        top: window.pageYOffset || this.document.documentElement.scrollTop,
        left: window.pageXOffset || this.document.documentElement.scrollLeft
      };
    }
  }
  shouldBeginDrag(event, touchMoveEvent, startScrollPosition) {
    const moveScrollPosition = this.getScrollPosition();
    const deltaScroll = {
      top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
      left: Math.abs(moveScrollPosition.left - startScrollPosition.left)
    };
    const deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
    const deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
    const deltaTotal = deltaX + deltaY;
    const longPressConfig = this.touchStartLongPress;
    if (deltaTotal > longPressConfig.delta || deltaScroll.top > 0 || deltaScroll.left > 0) {
      this.timeLongPress.timerBegin = Date.now();
    }
    this.timeLongPress.timerEnd = Date.now();
    const duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
    if (duration >= longPressConfig.delay) {
      this.disableScroll();
      return true;
    }
    return false;
  }
  enableScroll() {
    if (this.scrollContainer) {
      this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', '');
    }
    this.renderer.setStyle(this.document.body, 'overflow', '');
  }
  disableScroll() {
    /* istanbul ignore next */
    if (this.scrollContainer) {
      this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', 'hidden');
    }
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }
  hasScrollbar() {
    const scrollContainer = this.getScrollElement();
    const containerHasHorizontalScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
    const containerHasVerticalScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
    return containerHasHorizontalScroll || containerHasVerticalScroll;
  }
}
DraggableDirective.ɵfac = function DraggableDirective_Factory(t) {
  return new (t || DraggableDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableHelper), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableScrollContainerDirective, 8), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_18__.DOCUMENT));
};
DraggableDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: DraggableDirective,
  selectors: [["", "mwlDraggable", ""]],
  inputs: {
    dropData: "dropData",
    dragAxis: "dragAxis",
    dragSnapGrid: "dragSnapGrid",
    ghostDragEnabled: "ghostDragEnabled",
    showOriginalElementWhileDragging: "showOriginalElementWhileDragging",
    validateDrag: "validateDrag",
    dragCursor: "dragCursor",
    dragActiveClass: "dragActiveClass",
    ghostElementAppendTo: "ghostElementAppendTo",
    ghostElementTemplate: "ghostElementTemplate",
    touchStartLongPress: "touchStartLongPress",
    autoScroll: "autoScroll"
  },
  outputs: {
    dragPointerDown: "dragPointerDown",
    dragStart: "dragStart",
    ghostElementCreated: "ghostElementCreated",
    dragging: "dragging",
    dragEnd: "dragEnd"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DraggableDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlDraggable]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: DraggableHelper
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef
    }, {
      type: DraggableScrollContainerDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Optional
      }]
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_18__.DOCUMENT]
      }]
    }];
  }, {
    dropData: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragAxis: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragSnapGrid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    ghostDragEnabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    showOriginalElementWhileDragging: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateDrag: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragCursor: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragActiveClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    ghostElementAppendTo: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    ghostElementTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    touchStartLongPress: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    autoScroll: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragPointerDown: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragStart: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    ghostElementCreated: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragging: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragEnd: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
function isCoordinateWithinRectangle(clientX, clientY, rect) {
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}
class DroppableDirective {
  constructor(element, draggableHelper, zone, renderer, scrollContainer) {
    this.element = element;
    this.draggableHelper = draggableHelper;
    this.zone = zone;
    this.renderer = renderer;
    this.scrollContainer = scrollContainer;
    /**
     * Called when a draggable element starts overlapping the element
     */
    this.dragEnter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a draggable element stops overlapping the element
     */
    this.dragLeave = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a draggable element is moved over the element
     */
    this.dragOver = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a draggable element is dropped on this element
     */
    this.drop = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter(); // eslint-disable-line  @angular-eslint/no-output-native
  }

  ngOnInit() {
    this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(drag$ => {
      addClass(this.renderer, this.element, this.dragActiveClass);
      const droppableElement = {
        updateCache: true
      };
      const deregisterScrollListener = this.renderer.listen(this.scrollContainer ? this.scrollContainer.elementRef.nativeElement : 'window', 'scroll', () => {
        droppableElement.updateCache = true;
      });
      let currentDragEvent;
      const overlaps$ = drag$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(({
        clientX,
        clientY,
        dropData,
        target
      }) => {
        currentDragEvent = {
          clientX,
          clientY,
          dropData,
          target
        };
        if (droppableElement.updateCache) {
          droppableElement.rect = this.element.nativeElement.getBoundingClientRect();
          if (this.scrollContainer) {
            droppableElement.scrollContainerRect = this.scrollContainer.elementRef.nativeElement.getBoundingClientRect();
          }
          droppableElement.updateCache = false;
        }
        const isWithinElement = isCoordinateWithinRectangle(clientX, clientY, droppableElement.rect);
        const isDropAllowed = !this.validateDrop || this.validateDrop({
          clientX,
          clientY,
          target,
          dropData
        });
        if (droppableElement.scrollContainerRect) {
          return isWithinElement && isDropAllowed && isCoordinateWithinRectangle(clientX, clientY, droppableElement.scrollContainerRect);
        } else {
          return isWithinElement && isDropAllowed;
        }
      }));
      const overlapsChanged$ = overlaps$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_19__.distinctUntilChanged)());
      let dragOverActive; // TODO - see if there's a way of doing this via rxjs
      overlapsChanged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(overlapsNow => overlapsNow)).subscribe(() => {
        dragOverActive = true;
        addClass(this.renderer, this.element, this.dragOverClass);
        if (this.dragEnter.observers.length > 0) {
          this.zone.run(() => {
            this.dragEnter.next(currentDragEvent);
          });
        }
      });
      overlaps$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(overlapsNow => overlapsNow)).subscribe(() => {
        if (this.dragOver.observers.length > 0) {
          this.zone.run(() => {
            this.dragOver.next(currentDragEvent);
          });
        }
      });
      overlapsChanged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.pairwise)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow)).subscribe(() => {
        dragOverActive = false;
        removeClass(this.renderer, this.element, this.dragOverClass);
        if (this.dragLeave.observers.length > 0) {
          this.zone.run(() => {
            this.dragLeave.next(currentDragEvent);
          });
        }
      });
      drag$.subscribe({
        complete: () => {
          deregisterScrollListener();
          removeClass(this.renderer, this.element, this.dragActiveClass);
          if (dragOverActive) {
            removeClass(this.renderer, this.element, this.dragOverClass);
            if (this.drop.observers.length > 0) {
              this.zone.run(() => {
                this.drop.next(currentDragEvent);
              });
            }
          }
        }
      });
    });
  }
  ngOnDestroy() {
    if (this.currentDragSubscription) {
      this.currentDragSubscription.unsubscribe();
    }
  }
}
DroppableDirective.ɵfac = function DroppableDirective_Factory(t) {
  return new (t || DroppableDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableHelper), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableScrollContainerDirective, 8));
};
DroppableDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: DroppableDirective,
  selectors: [["", "mwlDroppable", ""]],
  inputs: {
    dragOverClass: "dragOverClass",
    dragActiveClass: "dragActiveClass",
    validateDrop: "validateDrop"
  },
  outputs: {
    dragEnter: "dragEnter",
    dragLeave: "dragLeave",
    dragOver: "dragOver",
    drop: "drop"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DroppableDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlDroppable]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: DraggableHelper
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: DraggableScrollContainerDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Optional
      }]
    }];
  }, {
    dragOverClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragActiveClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateDrop: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragEnter: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragLeave: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragOver: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    drop: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class DragAndDropModule {}
DragAndDropModule.ɵfac = function DragAndDropModule_Factory(t) {
  return new (t || DragAndDropModule)();
};
DragAndDropModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: DragAndDropModule
});
DragAndDropModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DragAndDropModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      declarations: [DraggableDirective, DroppableDirective, DraggableScrollContainerDirective],
      exports: [DraggableDirective, DroppableDirective, DraggableScrollContainerDirective]
    }]
  }], null, null);
})();

/*
 * Public API Surface of angular-draggable-droppable
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-draggable-droppable.mjs.map

/***/ }),

/***/ 9175:
/*!***************************************************************************************!*\
  !*** ./node_modules/angular-resizable-element/fesm2020/angular-resizable-element.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResizableDirective: () => (/* binding */ ResizableDirective),
/* harmony export */   ResizableModule: () => (/* binding */ ResizableModule),
/* harmony export */   ResizeHandleDirective: () => (/* binding */ ResizeHandleDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 7835);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 12235);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 59016);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 13738);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 85584);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 72607);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 81527);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 99422);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 20274);






/**
 * @hidden
 */
const IS_TOUCH_DEVICE = (() => {
  // In case we're in Node.js environment.
  if (typeof window === 'undefined') {
    return false;
  } else {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }
})();

/** Creates a deep clone of an element. */
function deepCloneNode(node) {
  const clone = node.cloneNode(true);
  const descendantsWithId = clone.querySelectorAll('[id]');
  const nodeName = node.nodeName.toLowerCase();
  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  descendantsWithId.forEach(descendant => {
    descendant.removeAttribute('id');
  });
  if (nodeName === 'canvas') {
    transferCanvasData(node, clone);
  } else if (nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea') {
    transferInputData(node, clone);
  }
  transferData('canvas', node, clone, transferCanvasData);
  transferData('input, textarea, select', node, clone, transferInputData);
  return clone;
}
/** Matches elements between an element and its clone and allows for their data to be cloned. */
function transferData(selector, node, clone, callback) {
  const descendantElements = node.querySelectorAll(selector);
  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll(selector);
    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[i], cloneElements[i]);
    }
  }
}
// Counter for unique cloned radio button names.
let cloneUniqueId = 0;
/** Transfers the data of one input element to another. */
function transferInputData(source, clone) {
  // Browsers throw an error when assigning the value of a file input programmatically.
  if (clone.type !== 'file') {
    clone.value = source.value;
  }
  // Radio button `name` attributes must be unique for radio button groups
  // otherwise original radio buttons can lose their checked state
  // once the clone is inserted in the DOM.
  if (clone.type === 'radio' && clone.name) {
    clone.name = `mat-clone-${clone.name}-${cloneUniqueId++}`;
  }
}
/** Transfers the data of one canvas element to another. */
function transferCanvasData(source, clone) {
  const context = clone.getContext('2d');
  if (context) {
    // In some cases `drawImage` can throw (e.g. if the canvas size is 0x0).
    // We can't do much about it so just ignore the error.
    try {
      context.drawImage(source, 0, 0);
    } catch {}
  }
}
function getNewBoundingRectangle(startingRect, edges, clientX, clientY) {
  const newBoundingRect = {
    top: startingRect.top,
    bottom: startingRect.bottom,
    left: startingRect.left,
    right: startingRect.right
  };
  if (edges.top) {
    newBoundingRect.top += clientY;
  }
  if (edges.bottom) {
    newBoundingRect.bottom += clientY;
  }
  if (edges.left) {
    newBoundingRect.left += clientX;
  }
  if (edges.right) {
    newBoundingRect.right += clientX;
  }
  newBoundingRect.height = newBoundingRect.bottom - newBoundingRect.top;
  newBoundingRect.width = newBoundingRect.right - newBoundingRect.left;
  return newBoundingRect;
}
function getElementRect(element, ghostElementPositioning) {
  let translateX = 0;
  let translateY = 0;
  const style = element.nativeElement.style;
  const transformProperties = ['transform', '-ms-transform', '-moz-transform', '-o-transform'];
  const transform = transformProperties.map(property => style[property]).find(value => !!value);
  if (transform && transform.includes('translate')) {
    translateX = transform.replace(/.*translate3?d?\((-?[0-9]*)px, (-?[0-9]*)px.*/, '$1');
    translateY = transform.replace(/.*translate3?d?\((-?[0-9]*)px, (-?[0-9]*)px.*/, '$2');
  }
  if (ghostElementPositioning === 'absolute') {
    return {
      height: element.nativeElement.offsetHeight,
      width: element.nativeElement.offsetWidth,
      top: element.nativeElement.offsetTop - translateY,
      bottom: element.nativeElement.offsetHeight + element.nativeElement.offsetTop - translateY,
      left: element.nativeElement.offsetLeft - translateX,
      right: element.nativeElement.offsetWidth + element.nativeElement.offsetLeft - translateX
    };
  } else {
    const boundingRect = element.nativeElement.getBoundingClientRect();
    return {
      height: boundingRect.height,
      width: boundingRect.width,
      top: boundingRect.top - translateY,
      bottom: boundingRect.bottom - translateY,
      left: boundingRect.left - translateX,
      right: boundingRect.right - translateX,
      scrollTop: element.nativeElement.scrollTop,
      scrollLeft: element.nativeElement.scrollLeft
    };
  }
}
const DEFAULT_RESIZE_CURSORS = Object.freeze({
  topLeft: 'nw-resize',
  topRight: 'ne-resize',
  bottomLeft: 'sw-resize',
  bottomRight: 'se-resize',
  leftOrRight: 'col-resize',
  topOrBottom: 'row-resize'
});
function getResizeCursor(edges, cursors) {
  if (edges.left && edges.top) {
    return cursors.topLeft;
  } else if (edges.right && edges.top) {
    return cursors.topRight;
  } else if (edges.left && edges.bottom) {
    return cursors.bottomLeft;
  } else if (edges.right && edges.bottom) {
    return cursors.bottomRight;
  } else if (edges.left || edges.right) {
    return cursors.leftOrRight;
  } else if (edges.top || edges.bottom) {
    return cursors.topOrBottom;
  } else {
    return '';
  }
}
function getEdgesDiff({
  edges,
  initialRectangle,
  newRectangle
}) {
  const edgesDiff = {};
  Object.keys(edges).forEach(edge => {
    edgesDiff[edge] = (newRectangle[edge] || 0) - (initialRectangle[edge] || 0);
  });
  return edgesDiff;
}
const RESIZE_ACTIVE_CLASS = 'resize-active';
const RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
const MOUSE_MOVE_THROTTLE_MS = 50;
/**
 * Place this on an element to make it resizable. For example:
 *
 * ```html
 * <div
 *   mwlResizable
 *   [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
 *   [enableGhostResize]="true">
 * </div>
 * ```
 * Or in case they are sibling elements:
 * ```html
 * <div mwlResizable #resizableElement="mwlResizable"></div>
 * <div mwlResizeHandle [resizableContainer]="resizableElement" [resizeEdges]="{bottom: true, right: true}"></div>
 * ```
 */
class ResizableDirective {
  /**
   * @hidden
   */
  constructor(platformId, renderer, elm, zone) {
    this.platformId = platformId;
    this.renderer = renderer;
    this.elm = elm;
    this.zone = zone;
    /**
     * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
     */
    this.enableGhostResize = false;
    /**
     * A snap grid that resize events will be locked to.
     *
     * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
     */
    this.resizeSnapGrid = {};
    /**
     * The mouse cursors that will be set on the resize edges
     */
    this.resizeCursors = DEFAULT_RESIZE_CURSORS;
    /**
     * Define the positioning of the ghost element (can be fixed or absolute)
     */
    this.ghostElementPositioning = 'fixed';
    /**
     * Allow elements to be resized to negative dimensions
     */
    this.allowNegativeResizes = false;
    /**
     * The mouse move throttle in milliseconds, default: 50 ms
     */
    this.mouseMoveThrottleMS = MOUSE_MOVE_THROTTLE_MS;
    /**
     * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
     */
    this.resizeStart = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
     */
    this.resizing = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
     */
    this.resizeEnd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * @hidden
     */
    this.mouseup = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.mousedown = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.mousemove = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.pointerEventListeners = PointerEventListeners.getInstance(renderer, zone);
  }
  /**
   * @hidden
   */
  ngOnInit() {
    const mousedown$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.pointerEventListeners.pointerDown, this.mousedown);
    const mousemove$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.pointerEventListeners.pointerMove, this.mousemove).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(({
      event
    }) => {
      if (currentResize && event.cancelable) {
        event.preventDefault();
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
    const mouseup$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.pointerEventListeners.pointerUp, this.mouseup);
    let currentResize;
    const removeGhostElement = () => {
      if (currentResize && currentResize.clonedNode) {
        this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
        this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'inherit');
      }
    };
    const getResizeCursors = () => {
      return {
        ...DEFAULT_RESIZE_CURSORS,
        ...this.resizeCursors
      };
    };
    const mousedrag = mousedown$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(startCoords => {
      function getDiff(moveCoords) {
        return {
          clientX: moveCoords.clientX - startCoords.clientX,
          clientY: moveCoords.clientY - startCoords.clientY
        };
      }
      const getSnapGrid = () => {
        const snapGrid = {
          x: 1,
          y: 1
        };
        if (currentResize) {
          if (this.resizeSnapGrid.left && currentResize.edges.left) {
            snapGrid.x = +this.resizeSnapGrid.left;
          } else if (this.resizeSnapGrid.right && currentResize.edges.right) {
            snapGrid.x = +this.resizeSnapGrid.right;
          }
          if (this.resizeSnapGrid.top && currentResize.edges.top) {
            snapGrid.y = +this.resizeSnapGrid.top;
          } else if (this.resizeSnapGrid.bottom && currentResize.edges.bottom) {
            snapGrid.y = +this.resizeSnapGrid.bottom;
          }
        }
        return snapGrid;
      };
      function getGrid(coords, snapGrid) {
        return {
          x: Math.ceil(coords.clientX / snapGrid.x),
          y: Math.ceil(coords.clientY / snapGrid.y)
        };
      }
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(mousemove$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.take)(1)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(coords => [, coords])), mousemove$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.pairwise)())).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([previousCoords, newCoords]) => {
        return [previousCoords ? getDiff(previousCoords) : previousCoords, getDiff(newCoords)];
      })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(([previousCoords, newCoords]) => {
        if (!previousCoords) {
          return true;
        }
        const snapGrid = getSnapGrid();
        const previousGrid = getGrid(previousCoords, snapGrid);
        const newGrid = getGrid(newCoords, snapGrid);
        return previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y;
      })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([, newCoords]) => {
        const snapGrid = getSnapGrid();
        return {
          clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
          clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
        };
      })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(mouseup$, mousedown$)));
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(() => !!currentResize));
    mousedrag.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(({
      clientX,
      clientY
    }) => {
      return getNewBoundingRectangle(currentResize.startingRect, currentResize.edges, clientX, clientY);
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(newBoundingRect => {
      return this.allowNegativeResizes || !!(newBoundingRect.height && newBoundingRect.width && newBoundingRect.height > 0 && newBoundingRect.width > 0);
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(newBoundingRect => {
      return this.validateResize ? this.validateResize({
        rectangle: newBoundingRect,
        edges: getEdgesDiff({
          edges: currentResize.edges,
          initialRectangle: currentResize.startingRect,
          newRectangle: newBoundingRect
        })
      }) : true;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(newBoundingRect => {
      if (currentResize && currentResize.clonedNode) {
        this.renderer.setStyle(currentResize.clonedNode, 'height', `${newBoundingRect.height}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'width', `${newBoundingRect.width}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'top', `${newBoundingRect.top}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'left', `${newBoundingRect.left}px`);
      }
      if (this.resizing.observers.length > 0) {
        this.zone.run(() => {
          this.resizing.emit({
            edges: getEdgesDiff({
              edges: currentResize.edges,
              initialRectangle: currentResize.startingRect,
              newRectangle: newBoundingRect
            }),
            rectangle: newBoundingRect
          });
        });
      }
      currentResize.currentRect = newBoundingRect;
    });
    mousedown$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(({
      edges
    }) => {
      return edges || {};
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(edges => {
      return Object.keys(edges).length > 0;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(edges => {
      if (currentResize) {
        removeGhostElement();
      }
      const startingRect = getElementRect(this.elm, this.ghostElementPositioning);
      currentResize = {
        edges,
        startingRect,
        currentRect: startingRect
      };
      const resizeCursors = getResizeCursors();
      const cursor = getResizeCursor(currentResize.edges, resizeCursors);
      this.renderer.setStyle(document.body, 'cursor', cursor);
      this.setElementClass(this.elm, RESIZE_ACTIVE_CLASS, true);
      if (this.enableGhostResize) {
        currentResize.clonedNode = deepCloneNode(this.elm.nativeElement);
        this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
        this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'hidden');
        this.renderer.setStyle(currentResize.clonedNode, 'position', this.ghostElementPositioning);
        this.renderer.setStyle(currentResize.clonedNode, 'left', `${currentResize.startingRect.left}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'top', `${currentResize.startingRect.top}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'height', `${currentResize.startingRect.height}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'width', `${currentResize.startingRect.width}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
        this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS);
        currentResize.clonedNode.scrollTop = currentResize.startingRect.scrollTop;
        currentResize.clonedNode.scrollLeft = currentResize.startingRect.scrollLeft;
      }
      if (this.resizeStart.observers.length > 0) {
        this.zone.run(() => {
          this.resizeStart.emit({
            edges: getEdgesDiff({
              edges,
              initialRectangle: startingRect,
              newRectangle: startingRect
            }),
            rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
          });
        });
      }
    });
    mouseup$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(() => {
      if (currentResize) {
        this.renderer.removeClass(this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
        this.renderer.setStyle(document.body, 'cursor', '');
        this.renderer.setStyle(this.elm.nativeElement, 'cursor', '');
        if (this.resizeEnd.observers.length > 0) {
          this.zone.run(() => {
            this.resizeEnd.emit({
              edges: getEdgesDiff({
                edges: currentResize.edges,
                initialRectangle: currentResize.startingRect,
                newRectangle: currentResize.currentRect
              }),
              rectangle: currentResize.currentRect
            });
          });
        }
        removeGhostElement();
        currentResize = null;
      }
    });
  }
  /**
   * @hidden
   */
  ngOnDestroy() {
    // browser check for angular universal, because it doesn't know what document is
    if ((0,_angular_common__WEBPACK_IMPORTED_MODULE_11__.isPlatformBrowser)(this.platformId)) {
      this.renderer.setStyle(document.body, 'cursor', '');
    }
    this.mousedown.complete();
    this.mouseup.complete();
    this.mousemove.complete();
    this.destroy$.next();
  }
  setElementClass(elm, name, add) {
    if (add) {
      this.renderer.addClass(elm.nativeElement, name);
    } else {
      this.renderer.removeClass(elm.nativeElement, name);
    }
  }
}
ResizableDirective.ɵfac = function ResizableDirective_Factory(t) {
  return new (t || ResizableDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.PLATFORM_ID), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone));
};
ResizableDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: ResizableDirective,
  selectors: [["", "mwlResizable", ""]],
  inputs: {
    validateResize: "validateResize",
    enableGhostResize: "enableGhostResize",
    resizeSnapGrid: "resizeSnapGrid",
    resizeCursors: "resizeCursors",
    ghostElementPositioning: "ghostElementPositioning",
    allowNegativeResizes: "allowNegativeResizes",
    mouseMoveThrottleMS: "mouseMoveThrottleMS"
  },
  outputs: {
    resizeStart: "resizeStart",
    resizing: "resizing",
    resizeEnd: "resizeEnd"
  },
  exportAs: ["mwlResizable"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResizableDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[mwlResizable]',
      exportAs: 'mwlResizable'
    }]
  }], function () {
    return [{
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__.PLATFORM_ID]
      }]
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
    }];
  }, {
    validateResize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    enableGhostResize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizeSnapGrid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizeCursors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    ghostElementPositioning: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    allowNegativeResizes: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    mouseMoveThrottleMS: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizeStart: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    resizing: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    resizeEnd: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }]
  });
})();
class PointerEventListeners {
  constructor(renderer, zone) {
    this.pointerDown = new rxjs__WEBPACK_IMPORTED_MODULE_12__.Observable(observer => {
      let unsubscribeMouseDown;
      let unsubscribeTouchStart;
      zone.runOutsideAngular(() => {
        unsubscribeMouseDown = renderer.listen('document', 'mousedown', event => {
          observer.next({
            clientX: event.clientX,
            clientY: event.clientY,
            event
          });
        });
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchStart = renderer.listen('document', 'touchstart', event => {
            observer.next({
              clientX: event.touches[0].clientX,
              clientY: event.touches[0].clientY,
              event
            });
          });
        }
      });
      return () => {
        unsubscribeMouseDown();
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchStart();
        }
      };
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
    this.pointerMove = new rxjs__WEBPACK_IMPORTED_MODULE_12__.Observable(observer => {
      let unsubscribeMouseMove;
      let unsubscribeTouchMove;
      zone.runOutsideAngular(() => {
        unsubscribeMouseMove = renderer.listen('document', 'mousemove', event => {
          observer.next({
            clientX: event.clientX,
            clientY: event.clientY,
            event
          });
        });
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchMove = renderer.listen('document', 'touchmove', event => {
            observer.next({
              clientX: event.targetTouches[0].clientX,
              clientY: event.targetTouches[0].clientY,
              event
            });
          });
        }
      });
      return () => {
        unsubscribeMouseMove();
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchMove();
        }
      };
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
    this.pointerUp = new rxjs__WEBPACK_IMPORTED_MODULE_12__.Observable(observer => {
      let unsubscribeMouseUp;
      let unsubscribeTouchEnd;
      let unsubscribeTouchCancel;
      zone.runOutsideAngular(() => {
        unsubscribeMouseUp = renderer.listen('document', 'mouseup', event => {
          observer.next({
            clientX: event.clientX,
            clientY: event.clientY,
            event
          });
        });
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchEnd = renderer.listen('document', 'touchend', event => {
            observer.next({
              clientX: event.changedTouches[0].clientX,
              clientY: event.changedTouches[0].clientY,
              event
            });
          });
          unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', event => {
            observer.next({
              clientX: event.changedTouches[0].clientX,
              clientY: event.changedTouches[0].clientY,
              event
            });
          });
        }
      });
      return () => {
        unsubscribeMouseUp();
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchEnd();
          unsubscribeTouchCancel();
        }
      };
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
  }
  static getInstance(renderer, zone) {
    if (!PointerEventListeners.instance) {
      PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
    }
    return PointerEventListeners.instance;
  }
}

/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```html
 * <div mwlResizable>
 *   <div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"></div>
 * </div>
 * ```
 * Or in case they are sibling elements:
 * ```html
 * <div mwlResizable #resizableElement="mwlResizable"></div>
 * <div mwlResizeHandle [resizableContainer]="resizableElement" [resizeEdges]="{bottom: true, right: true}"></div>
 * ```
 */
class ResizeHandleDirective {
  constructor(renderer, element, zone, resizableDirective) {
    this.renderer = renderer;
    this.element = element;
    this.zone = zone;
    this.resizableDirective = resizableDirective;
    /**
     * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
     */
    this.resizeEdges = {};
    this.eventListeners = {};
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  }
  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.listenOnTheHost('mousedown').subscribe(event => {
        this.onMousedown(event, event.clientX, event.clientY);
      });
      this.listenOnTheHost('mouseup').subscribe(event => {
        this.onMouseup(event.clientX, event.clientY);
      });
      if (IS_TOUCH_DEVICE) {
        this.listenOnTheHost('touchstart').subscribe(event => {
          this.onMousedown(event, event.touches[0].clientX, event.touches[0].clientY);
        });
        (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.listenOnTheHost('touchend'), this.listenOnTheHost('touchcancel')).subscribe(event => {
          this.onMouseup(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.unsubscribeEventListeners();
  }
  /**
   * @hidden
   */
  onMousedown(event, clientX, clientY) {
    if (event.cancelable) {
      event.preventDefault();
    }
    if (!this.eventListeners.touchmove) {
      this.eventListeners.touchmove = this.renderer.listen(this.element.nativeElement, 'touchmove', touchMoveEvent => {
        this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
      });
    }
    if (!this.eventListeners.mousemove) {
      this.eventListeners.mousemove = this.renderer.listen(this.element.nativeElement, 'mousemove', mouseMoveEvent => {
        this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
      });
    }
    this.resizable.mousedown.next({
      clientX,
      clientY,
      edges: this.resizeEdges
    });
  }
  /**
   * @hidden
   */
  onMouseup(clientX, clientY) {
    this.unsubscribeEventListeners();
    this.resizable.mouseup.next({
      clientX,
      clientY,
      edges: this.resizeEdges
    });
  }
  // directive might be passed from DI or as an input
  get resizable() {
    return this.resizableDirective || this.resizableContainer;
  }
  onMousemove(event, clientX, clientY) {
    this.resizable.mousemove.next({
      clientX,
      clientY,
      edges: this.resizeEdges,
      event
    });
  }
  unsubscribeEventListeners() {
    Object.keys(this.eventListeners).forEach(type => {
      this.eventListeners[type]();
      delete this.eventListeners[type];
    });
  }
  listenOnTheHost(eventName) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.fromEvent)(this.element.nativeElement, eventName).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$));
  }
}
ResizeHandleDirective.ɵfac = function ResizeHandleDirective_Factory(t) {
  return new (t || ResizeHandleDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](ResizableDirective, 8));
};
ResizeHandleDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: ResizeHandleDirective,
  selectors: [["", "mwlResizeHandle", ""]],
  inputs: {
    resizeEdges: "resizeEdges",
    resizableContainer: "resizableContainer"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResizeHandleDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[mwlResizeHandle]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
    }, {
      type: ResizableDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }]
    }];
  }, {
    resizeEdges: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizableContainer: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }]
  });
})();
class ResizableModule {}
ResizableModule.ɵfac = function ResizableModule_Factory(t) {
  return new (t || ResizableModule)();
};
ResizableModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: ResizableModule
});
ResizableModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResizableModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
    args: [{
      declarations: [ResizableDirective, ResizeHandleDirective],
      exports: [ResizableDirective, ResizeHandleDirective]
    }]
  }], null, null);
})();

/*
 * Public API Surface of angular-resizable-element
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-resizable-element.mjs.map

/***/ }),

/***/ 43445:
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_calendar_calendar_component_ts.js.map