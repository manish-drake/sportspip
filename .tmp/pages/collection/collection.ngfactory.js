/**
 * This file is generated by the Angular 2 template compiler.
 * Do not edit.
 */
/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import1 from '@angular/core/src/linker/view';
import * as import2 from '@angular/core/src/linker/element';
import * as import3 from './collection';
import * as import4 from '@angular/core/src/linker/view_utils';
import * as import6 from '@angular/core/src/linker/view_type';
import * as import7 from '@angular/core/src/change_detection/change_detection';
import * as import8 from 'ionic-angular/navigation/nav-controller';
import * as import9 from '@angular/core/src/metadata/view';
import * as import10 from '@angular/core/src/linker/component_factory';
import * as import11 from 'ionic-angular/components/toolbar/toolbar';
import * as import12 from 'ionic-angular/components/navbar/navbar';
import * as import13 from 'ionic-angular/components/toolbar/toolbar-title';
import * as import14 from 'ionic-angular/components/toolbar/toolbar-item';
import * as import15 from '@angular/core/src/linker/query_list';
import * as import16 from 'ionic-angular/components/button/button';
import * as import17 from 'ionic-angular/components/icon/icon';
import * as import18 from 'ionic-angular/components/searchbar/searchbar';
import * as import19 from 'ionic-angular/components/content/content';
import * as import20 from '@angular/common/src/directives/ng_for';
import * as import21 from 'ionic-angular/config/config';
import * as import22 from '@angular/core/src/linker/element_ref';
import * as import23 from 'ionic-angular/navigation/view-controller';
import * as import24 from '../../node_modules/ionic-angular/components/navbar/navbar.ngfactory';
import * as import25 from 'ionic-angular/components/app/app';
import * as import26 from '../../node_modules/ionic-angular/components/toolbar/toolbar-title.ngfactory';
import * as import27 from '../../node_modules/ionic-angular/components/button/button.ngfactory';
import * as import28 from '../../node_modules/ionic-angular/components/toolbar/toolbar.ngfactory';
import * as import29 from '../../node_modules/ionic-angular/components/searchbar/searchbar.ngfactory';
import * as import30 from '@angular/forms/src/directives/ng_control';
import * as import31 from '../../node_modules/ionic-angular/components/content/content.ngfactory';
import * as import32 from 'ionic-angular/util/keyboard';
import * as import33 from '@angular/core/src/zone/ng_zone';
import * as import34 from 'ionic-angular/components/tabs/tabs';
import * as import35 from '@angular/core/src/linker/template_ref';
import * as import36 from '@angular/core/src/change_detection/differs/iterable_differs';
import * as import37 from 'ionic-angular/components/card/card';
import * as import38 from 'ionic-angular/components/grid/grid';
import * as import39 from '@angular/core/src/security';
var renderType_CollectionPage_Host = null;
var _View_CollectionPage_Host0 = (function (_super) {
    __extends(_View_CollectionPage_Host0, _super);
    function _View_CollectionPage_Host0(viewUtils, parentInjector, declarationEl) {
        _super.call(this, _View_CollectionPage_Host0, renderType_CollectionPage_Host, import6.ViewType.HOST, viewUtils, parentInjector, declarationEl, import7.ChangeDetectorStatus.CheckAlways);
    }
    _View_CollectionPage_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = this.selectOrCreateHostElement('page-collection', rootSelector, null);
        this._appEl_0 = new import2.AppElement(0, null, this, this._el_0);
        var compView_0 = viewFactory_CollectionPage0(this.viewUtils, this.injector(0), this._appEl_0);
        this._CollectionPage_0_4 = new import3.CollectionPage(this.parentInjector.get(import8.NavController));
        this._appEl_0.initComponent(this._CollectionPage_0_4, [], compView_0);
        compView_0.create(this._CollectionPage_0_4, this.projectableNodes, null);
        this.init([].concat([this._el_0]), [this._el_0], [], []);
        return this._appEl_0;
    };
    _View_CollectionPage_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import3.CollectionPage) && (0 === requestNodeIndex))) {
            return this._CollectionPage_0_4;
        }
        return notFoundResult;
    };
    return _View_CollectionPage_Host0;
}(import1.AppView));
function viewFactory_CollectionPage_Host0(viewUtils, parentInjector, declarationEl) {
    if ((renderType_CollectionPage_Host === null)) {
        (renderType_CollectionPage_Host = viewUtils.createRenderComponentType('', 0, import9.ViewEncapsulation.None, [], {}));
    }
    return new _View_CollectionPage_Host0(viewUtils, parentInjector, declarationEl);
}
export var CollectionPageNgFactory = new import10.ComponentFactory('page-collection', viewFactory_CollectionPage_Host0, import3.CollectionPage);
var styles_CollectionPage = [];
var renderType_CollectionPage = null;
var _View_CollectionPage0 = (function (_super) {
    __extends(_View_CollectionPage0, _super);
    function _View_CollectionPage0(viewUtils, parentInjector, declarationEl) {
        _super.call(this, _View_CollectionPage0, renderType_CollectionPage, import6.ViewType.COMPONENT, viewUtils, parentInjector, declarationEl, import7.ChangeDetectorStatus.CheckAlways);
    }
    _View_CollectionPage0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.declarationAppElement.nativeElement);
        this._text_0 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_1 = this.renderer.createElement(parentRenderNode, 'ion-header', null);
        this._Header_1_3 = new import11.Header(this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_1), this.renderer, this.parentInjector.get(import23.ViewController, null));
        this._text_2 = this.renderer.createText(this._el_1, '\n\n  ', null);
        this._el_3 = this.renderer.createElement(this._el_1, 'ion-navbar', null);
        this.renderer.setElementAttribute(this._el_3, 'class', 'toolbar');
        this._appEl_3 = new import2.AppElement(3, 1, this, this._el_3);
        var compView_3 = import24.viewFactory_Navbar0(this.viewUtils, this.injector(3), this._appEl_3);
        this._Navbar_3_4 = new import12.Navbar(this.parentInjector.get(import25.App), this.parentInjector.get(import23.ViewController, null), this.parentInjector.get(import8.NavController, null), this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_3), this.renderer);
        this._appEl_3.initComponent(this._Navbar_3_4, [], compView_3);
        this._text_4 = this.renderer.createText(null, '\n    ', null);
        this._el_5 = this.renderer.createElement(null, 'ion-title', null);
        this._appEl_5 = new import2.AppElement(5, 3, this, this._el_5);
        var compView_5 = import26.viewFactory_ToolbarTitle0(this.viewUtils, this.injector(5), this._appEl_5);
        this._ToolbarTitle_5_4 = new import13.ToolbarTitle(this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_5), this.renderer, this.parentInjector.get(import11.Toolbar, null), this._Navbar_3_4);
        this._appEl_5.initComponent(this._ToolbarTitle_5_4, [], compView_5);
        this._text_6 = this.renderer.createText(null, 'Collection', null);
        compView_5.create(this._ToolbarTitle_5_4, [[].concat([this._text_6])], null);
        this._text_7 = this.renderer.createText(null, '\n    ', null);
        this._el_8 = this.renderer.createElement(null, 'ion-buttons', null);
        this.renderer.setElementAttribute(this._el_8, 'end', '');
        this._ToolbarItem_8_3 = new import14.ToolbarItem(this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_8), this.renderer, this.parentInjector.get(import11.Toolbar, null), this._Navbar_3_4);
        this._query_Button_8_0 = new import15.QueryList();
        this._text_9 = this.renderer.createText(this._el_8, '\n      ', null);
        this._el_10 = this.renderer.createElement(this._el_8, 'button', null);
        this.renderer.setElementAttribute(this._el_10, 'icon-only', '');
        this.renderer.setElementAttribute(this._el_10, 'ion-button', '');
        this._appEl_10 = new import2.AppElement(10, 8, this, this._el_10);
        var compView_10 = import27.viewFactory_Button0(this.viewUtils, this.injector(10), this._appEl_10);
        this._Button_10_4 = new import16.Button(null, '', this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_10), this.renderer);
        this._appEl_10.initComponent(this._Button_10_4, [], compView_10);
        this._el_11 = this.renderer.createElement(null, 'ion-icon', null);
        this.renderer.setElementAttribute(this._el_11, 'name', 'funnel');
        this.renderer.setElementAttribute(this._el_11, 'role', 'img');
        this._Icon_11_3 = new import17.Icon(this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_11), this.renderer);
        compView_10.create(this._Button_10_4, [[].concat([this._el_11])], null);
        this._text_12 = this.renderer.createText(this._el_8, '\n    ', null);
        this._text_13 = this.renderer.createText(null, '\n  ', null);
        compView_3.create(this._Navbar_3_4, [
            [],
            [],
            [].concat([this._el_8]),
            [].concat([
                this._text_4,
                this._el_5,
                this._text_7,
                this._text_13
            ])
        ], null);
        this._text_14 = this.renderer.createText(this._el_1, '\n  ', null);
        this._el_15 = this.renderer.createElement(this._el_1, 'ion-toolbar', null);
        this.renderer.setElementAttribute(this._el_15, 'class', 'toolbar');
        this._appEl_15 = new import2.AppElement(15, 1, this, this._el_15);
        var compView_15 = import28.viewFactory_Toolbar0(this.viewUtils, this.injector(15), this._appEl_15);
        this._Toolbar_15_4 = new import11.Toolbar(this.parentInjector.get(import23.ViewController, null), this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_15), this.renderer);
        this._appEl_15.initComponent(this._Toolbar_15_4, [], compView_15);
        this._text_16 = this.renderer.createText(null, '\n    ', null);
        this._el_17 = this.renderer.createElement(null, 'ion-searchbar', null);
        this._appEl_17 = new import2.AppElement(17, 15, this, this._el_17);
        var compView_17 = import29.viewFactory_Searchbar0(this.viewUtils, this.injector(17), this._appEl_17);
        this._Searchbar_17_4 = new import18.Searchbar(this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_17), this.renderer, this.parentInjector.get(import30.NgControl, null));
        this._appEl_17.initComponent(this._Searchbar_17_4, [], compView_17);
        compView_17.create(this._Searchbar_17_4, [], null);
        this._text_18 = this.renderer.createText(null, '\n  ', null);
        compView_15.create(this._Toolbar_15_4, [
            [],
            [],
            [],
            [].concat([
                this._text_16,
                this._el_17,
                this._text_18
            ])
        ], null);
        this._text_19 = this.renderer.createText(this._el_1, '\n\n', null);
        this._text_20 = this.renderer.createText(parentRenderNode, '\n\n\n', null);
        this._el_21 = this.renderer.createElement(parentRenderNode, 'ion-content', null);
        this.renderer.setElementAttribute(this._el_21, 'padding', '');
        this._appEl_21 = new import2.AppElement(21, null, this, this._el_21);
        var compView_21 = import31.viewFactory_Content0(this.viewUtils, this.injector(21), this._appEl_21);
        this._Content_21_4 = new import19.Content(this.parentInjector.get(import21.Config), new import22.ElementRef(this._el_21), this.renderer, this.parentInjector.get(import25.App), this.parentInjector.get(import32.Keyboard), this.parentInjector.get(import33.NgZone), this.parentInjector.get(import23.ViewController, null), this.parentInjector.get(import34.Tabs, null));
        this._appEl_21.initComponent(this._Content_21_4, [], compView_21);
        this._text_22 = this.renderer.createText(null, '\n  ', null);
        this._el_23 = this.renderer.createElement(null, 'div', null);
        this.renderer.setElementAttribute(this._el_23, 'class', 'items');
        this._text_24 = this.renderer.createText(this._el_23, '\n    ', null);
        this._anchor_25 = this.renderer.createTemplateAnchor(this._el_23, null);
        this._appEl_25 = new import2.AppElement(25, 23, this, this._anchor_25);
        this._TemplateRef_25_5 = new import35.TemplateRef_(this._appEl_25, viewFactory_CollectionPage1);
        this._NgFor_25_6 = new import20.NgFor(this._appEl_25.vcRef, this._TemplateRef_25_5, this.parentInjector.get(import36.IterableDiffers), this.ref);
        this._text_26 = this.renderer.createText(this._el_23, '\n  ', null);
        this._text_27 = this.renderer.createText(null, '\n', null);
        compView_21.create(this._Content_21_4, [
            [],
            [].concat([
                this._text_22,
                this._el_23,
                this._text_27
            ]),
            []
        ], null);
        this._expr_0 = import7.UNINITIALIZED;
        this._expr_1 = import7.UNINITIALIZED;
        this._expr_2 = import7.UNINITIALIZED;
        this._expr_3 = import7.UNINITIALIZED;
        this._expr_4 = import7.UNINITIALIZED;
        this._expr_5 = import7.UNINITIALIZED;
        this._expr_6 = import7.UNINITIALIZED;
        this._expr_7 = import7.UNINITIALIZED;
        this._expr_8 = import7.UNINITIALIZED;
        this._expr_9 = import7.UNINITIALIZED;
        this._expr_10 = import7.UNINITIALIZED;
        this._expr_11 = import7.UNINITIALIZED;
        this.init([], [
            this._text_0,
            this._el_1,
            this._text_2,
            this._el_3,
            this._text_4,
            this._el_5,
            this._text_6,
            this._text_7,
            this._el_8,
            this._text_9,
            this._el_10,
            this._el_11,
            this._text_12,
            this._text_13,
            this._text_14,
            this._el_15,
            this._text_16,
            this._el_17,
            this._text_18,
            this._text_19,
            this._text_20,
            this._el_21,
            this._text_22,
            this._el_23,
            this._text_24,
            this._anchor_25,
            this._text_26,
            this._text_27
        ], [], []);
        return null;
    };
    _View_CollectionPage0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import13.ToolbarTitle) && ((5 <= requestNodeIndex) && (requestNodeIndex <= 6)))) {
            return this._ToolbarTitle_5_4;
        }
        if (((token === import17.Icon) && (11 === requestNodeIndex))) {
            return this._Icon_11_3;
        }
        if (((token === import16.Button) && ((10 <= requestNodeIndex) && (requestNodeIndex <= 11)))) {
            return this._Button_10_4;
        }
        if (((token === import14.ToolbarItem) && ((8 <= requestNodeIndex) && (requestNodeIndex <= 12)))) {
            return this._ToolbarItem_8_3;
        }
        if (((token === import12.Navbar) && ((3 <= requestNodeIndex) && (requestNodeIndex <= 13)))) {
            return this._Navbar_3_4;
        }
        if (((token === import18.Searchbar) && (17 === requestNodeIndex))) {
            return this._Searchbar_17_4;
        }
        if (((token === import11.Toolbar) && ((15 <= requestNodeIndex) && (requestNodeIndex <= 18)))) {
            return this._Toolbar_15_4;
        }
        if (((token === import11.Header) && ((1 <= requestNodeIndex) && (requestNodeIndex <= 19)))) {
            return this._Header_1_3;
        }
        if (((token === import35.TemplateRef) && (25 === requestNodeIndex))) {
            return this._TemplateRef_25_5;
        }
        if (((token === import20.NgFor) && (25 === requestNodeIndex))) {
            return this._NgFor_25_6;
        }
        if (((token === import19.Content) && ((21 <= requestNodeIndex) && (requestNodeIndex <= 27)))) {
            return this._Content_21_4;
        }
        return notFoundResult;
    };
    _View_CollectionPage0.prototype.detectChangesInternal = function (throwOnChange) {
        var changes = null;
        var currVal_2 = 'funnel';
        if (import4.checkBinding(throwOnChange, this._expr_2, currVal_2)) {
            this._Icon_11_3.name = currVal_2;
            this._expr_2 = currVal_2;
        }
        if (((this.numberOfChecks === 0) && !throwOnChange)) {
            this._Searchbar_17_4.ngOnInit();
        }
        if (((this.numberOfChecks === 0) && !throwOnChange)) {
            this._Content_21_4.ngOnInit();
        }
        changes = null;
        var currVal_11 = this.context.localMatrices;
        if (import4.checkBinding(throwOnChange, this._expr_11, currVal_11)) {
            this._NgFor_25_6.ngForOf = currVal_11;
            if ((changes === null)) {
                (changes = {});
            }
            changes['ngForOf'] = new import7.SimpleChange(this._expr_11, currVal_11);
            this._expr_11 = currVal_11;
        }
        if ((changes !== null)) {
            this._NgFor_25_6.ngOnChanges(changes);
        }
        if (!throwOnChange) {
            this._NgFor_25_6.ngDoCheck();
        }
        this.detectContentChildrenChanges(throwOnChange);
        if (!throwOnChange) {
            if (this._query_Button_8_0.dirty) {
                this._query_Button_8_0.reset([this._Button_10_4]);
                this._ToolbarItem_8_3._buttons = this._query_Button_8_0;
                this._query_Button_8_0.notifyOnChanges();
            }
            if ((this.numberOfChecks === 0)) {
                this._Button_10_4.ngAfterContentInit();
            }
        }
        var currVal_0 = this._Navbar_3_4._hidden;
        if (import4.checkBinding(throwOnChange, this._expr_0, currVal_0)) {
            this.renderer.setElementProperty(this._el_3, 'hidden', currVal_0);
            this._expr_0 = currVal_0;
        }
        var currVal_1 = this._Navbar_3_4._sbPadding;
        if (import4.checkBinding(throwOnChange, this._expr_1, currVal_1)) {
            this.renderer.setElementClass(this._el_3, 'statusbar-padding', currVal_1);
            this._expr_1 = currVal_1;
        }
        var currVal_3 = this._Icon_11_3._hidden;
        if (import4.checkBinding(throwOnChange, this._expr_3, currVal_3)) {
            this.renderer.setElementClass(this._el_11, 'hide', currVal_3);
            this._expr_3 = currVal_3;
        }
        var currVal_4 = this._Toolbar_15_4._sbPadding;
        if (import4.checkBinding(throwOnChange, this._expr_4, currVal_4)) {
            this.renderer.setElementClass(this._el_15, 'statusbar-padding', currVal_4);
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this._Searchbar_17_4._value;
        if (import4.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setElementClass(this._el_17, 'searchbar-has-value', currVal_5);
            this._expr_5 = currVal_5;
        }
        var currVal_6 = this._Searchbar_17_4._isActive;
        if (import4.checkBinding(throwOnChange, this._expr_6, currVal_6)) {
            this.renderer.setElementClass(this._el_17, 'searchbar-active', currVal_6);
            this._expr_6 = currVal_6;
        }
        var currVal_7 = this._Searchbar_17_4.showCancelButton;
        if (import4.checkBinding(throwOnChange, this._expr_7, currVal_7)) {
            this.renderer.setElementClass(this._el_17, 'searchbar-show-cancel', currVal_7);
            this._expr_7 = currVal_7;
        }
        var currVal_8 = this._Searchbar_17_4.shouldAlignLeft();
        if (import4.checkBinding(throwOnChange, this._expr_8, currVal_8)) {
            this.renderer.setElementClass(this._el_17, 'searchbar-left-aligned', currVal_8);
            this._expr_8 = currVal_8;
        }
        var currVal_9 = this._Searchbar_17_4._sbHasFocus;
        if (import4.checkBinding(throwOnChange, this._expr_9, currVal_9)) {
            this.renderer.setElementClass(this._el_17, 'searchbar-has-focus', currVal_9);
            this._expr_9 = currVal_9;
        }
        var currVal_10 = this._Content_21_4._sbPadding;
        if (import4.checkBinding(throwOnChange, this._expr_10, currVal_10)) {
            this.renderer.setElementClass(this._el_21, 'statusbar-padding', currVal_10);
            this._expr_10 = currVal_10;
        }
        this.detectViewChildrenChanges(throwOnChange);
        if (!throwOnChange) {
            if ((this.numberOfChecks === 0)) {
                this._Navbar_3_4.ngAfterViewInit();
            }
            this._Searchbar_17_4.ngAfterViewChecked();
        }
    };
    _View_CollectionPage0.prototype.destroyInternal = function () {
        this._Icon_11_3.ngOnDestroy();
        this._Content_21_4.ngOnDestroy();
    };
    return _View_CollectionPage0;
}(import1.AppView));
export function viewFactory_CollectionPage0(viewUtils, parentInjector, declarationEl) {
    if ((renderType_CollectionPage === null)) {
        (renderType_CollectionPage = viewUtils.createRenderComponentType('d:/git/sportspip/.tmp/pages/collection/collection.html', 0, import9.ViewEncapsulation.None, styles_CollectionPage, {}));
    }
    return new _View_CollectionPage0(viewUtils, parentInjector, declarationEl);
}
var _View_CollectionPage1 = (function (_super) {
    __extends(_View_CollectionPage1, _super);
    function _View_CollectionPage1(viewUtils, parentInjector, declarationEl) {
        _super.call(this, _View_CollectionPage1, renderType_CollectionPage, import6.ViewType.EMBEDDED, viewUtils, parentInjector, declarationEl, import7.ChangeDetectorStatus.CheckAlways);
    }
    _View_CollectionPage1.prototype.createInternal = function (rootSelector) {
        this._el_0 = this.renderer.createElement(null, 'div', null);
        this.renderer.setElementAttribute(this._el_0, 'class', 'item');
        this._text_1 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_2 = this.renderer.createElement(this._el_0, 'ion-card', null);
        this._Card_2_3 = new import37.Card(this.parent.parentInjector.get(import21.Config), new import22.ElementRef(this._el_2), this.renderer);
        this._text_3 = this.renderer.createText(this._el_2, '\n        ', null);
        this._el_4 = this.renderer.createElement(this._el_2, 'img', null);
        this._text_5 = this.renderer.createText(this._el_2, '\n        ', null);
        this._el_6 = this.renderer.createElement(this._el_2, 'ion-card-content', null);
        this._CardContent_6_3 = new import37.CardContent();
        this._text_7 = this.renderer.createText(this._el_6, '\n          ', null);
        this._el_8 = this.renderer.createElement(this._el_6, 'ion-card-title', null);
        this.renderer.setElementAttribute(this._el_8, 'style', 'font-size:18px;flex-wrap: nowrap;');
        this._CardTitle_8_3 = new import37.CardTitle();
        this._text_9 = this.renderer.createText(this._el_8, '\n            ', null);
        this._el_10 = this.renderer.createElement(this._el_8, 'ion-row', null);
        this._Row_10_3 = new import38.Row();
        this._text_11 = this.renderer.createText(this._el_10, '\n              ', null);
        this._el_12 = this.renderer.createElement(this._el_10, 'ion-col', null);
        this._Col_12_3 = new import38.Col();
        this._text_13 = this.renderer.createText(this._el_12, '\n                ', null);
        this._el_14 = this.renderer.createElement(this._el_12, 'div', null);
        this.renderer.setElementAttribute(this._el_14, 'style', 'text-overflow:ellipsis;');
        this._text_15 = this.renderer.createText(this._el_14, '', null);
        this._text_16 = this.renderer.createText(this._el_12, '\n              ', null);
        this._text_17 = this.renderer.createText(this._el_10, '\n              ', null);
        this._el_18 = this.renderer.createElement(this._el_10, 'ion-col', null);
        this.renderer.setElementAttribute(this._el_18, 'center', '');
        this.renderer.setElementAttribute(this._el_18, 'style', 'width:10px;');
        this.renderer.setElementAttribute(this._el_18, 'text-right', '');
        this._Col_18_3 = new import38.Col();
        this._text_19 = this.renderer.createText(this._el_18, '\n                ', null);
        this._el_20 = this.renderer.createElement(this._el_18, 'p', null);
        this._text_21 = this.renderer.createText(this._el_20, 'Oct 3', null);
        this._text_22 = this.renderer.createText(this._el_18, '\n              ', null);
        this._text_23 = this.renderer.createText(this._el_10, '\n            ', null);
        this._text_24 = this.renderer.createText(this._el_8, '\n          ', null);
        this._text_25 = this.renderer.createText(this._el_6, '\n          ', null);
        this._el_26 = this.renderer.createElement(this._el_6, 'div', null);
        this.renderer.setElementAttribute(this._el_26, 'style', 'display:block;');
        this._text_27 = this.renderer.createText(this._el_26, '\n            ', null);
        this._el_28 = this.renderer.createElement(this._el_26, 'p', null);
        this._text_29 = this.renderer.createText(this._el_28, 'Sport/Skill', null);
        this._text_30 = this.renderer.createText(this._el_26, '\n            ', null);
        this._el_31 = this.renderer.createElement(this._el_26, 'p', null);
        this._text_32 = this.renderer.createText(this._el_31, '00:00', null);
        this._text_33 = this.renderer.createText(this._el_26, '\n          ', null);
        this._text_34 = this.renderer.createText(this._el_6, '\n        ', null);
        this._text_35 = this.renderer.createText(this._el_2, '\n      ', null);
        this._text_36 = this.renderer.createText(this._el_0, '\n    ', null);
        var disposable_0 = this.renderer.listen(this._el_2, 'click', this.eventHandler(this._handle_click_2_0.bind(this)));
        this._expr_1 = import7.UNINITIALIZED;
        this._expr_2 = import7.UNINITIALIZED;
        this.init([].concat([this._el_0]), [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._el_6,
            this._text_7,
            this._el_8,
            this._text_9,
            this._el_10,
            this._text_11,
            this._el_12,
            this._text_13,
            this._el_14,
            this._text_15,
            this._text_16,
            this._text_17,
            this._el_18,
            this._text_19,
            this._el_20,
            this._text_21,
            this._text_22,
            this._text_23,
            this._text_24,
            this._text_25,
            this._el_26,
            this._text_27,
            this._el_28,
            this._text_29,
            this._text_30,
            this._el_31,
            this._text_32,
            this._text_33,
            this._text_34,
            this._text_35,
            this._text_36
        ], [disposable_0], []);
        return null;
    };
    _View_CollectionPage1.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import38.Col) && ((12 <= requestNodeIndex) && (requestNodeIndex <= 16)))) {
            return this._Col_12_3;
        }
        if (((token === import38.Col) && ((18 <= requestNodeIndex) && (requestNodeIndex <= 22)))) {
            return this._Col_18_3;
        }
        if (((token === import38.Row) && ((10 <= requestNodeIndex) && (requestNodeIndex <= 23)))) {
            return this._Row_10_3;
        }
        if (((token === import37.CardTitle) && ((8 <= requestNodeIndex) && (requestNodeIndex <= 24)))) {
            return this._CardTitle_8_3;
        }
        if (((token === import37.CardContent) && ((6 <= requestNodeIndex) && (requestNodeIndex <= 34)))) {
            return this._CardContent_6_3;
        }
        if (((token === import37.Card) && ((2 <= requestNodeIndex) && (requestNodeIndex <= 35)))) {
            return this._Card_2_3;
        }
        return notFoundResult;
    };
    _View_CollectionPage1.prototype.detectChangesInternal = function (throwOnChange) {
        this.detectContentChildrenChanges(throwOnChange);
        var currVal_1 = this.context.$implicit.image;
        if (import4.checkBinding(throwOnChange, this._expr_1, currVal_1)) {
            this.renderer.setElementProperty(this._el_4, 'src', this.viewUtils.sanitizer.sanitize(import39.SecurityContext.URL, currVal_1));
            this._expr_1 = currVal_1;
        }
        var currVal_2 = import4.interpolate(1, '', this.context.$implicit.title, '');
        if (import4.checkBinding(throwOnChange, this._expr_2, currVal_2)) {
            this.renderer.setText(this._text_15, currVal_2);
            this._expr_2 = currVal_2;
        }
        this.detectViewChildrenChanges(throwOnChange);
    };
    _View_CollectionPage1.prototype._handle_click_2_0 = function ($event) {
        this.markPathToRootAsCheckOnce();
        var pd_0 = (this.parent.context.openMatrix(this.context.$implicit.title) !== false);
        return (true && pd_0);
    };
    return _View_CollectionPage1;
}(import1.AppView));
function viewFactory_CollectionPage1(viewUtils, parentInjector, declarationEl) {
    return new _View_CollectionPage1(viewUtils, parentInjector, declarationEl);
}
