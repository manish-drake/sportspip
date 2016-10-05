/**
 * This file is generated by the Angular 2 template compiler.
 * Do not edit.
 */
 /* tslint:disable */

import * as import0 from '@angular/core/src/render/api';
import * as import1 from '@angular/core/src/linker/view';
import * as import2 from '@angular/core/src/linker/element';
import * as import3 from './collection';
import * as import4 from '@angular/core/src/linker/view_utils';
import * as import5 from '@angular/core/src/di/injector';
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
var renderType_CollectionPage_Host:import0.RenderComponentType = (null as any);
class _View_CollectionPage_Host0 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _appEl_0:import2.AppElement;
  _CollectionPage_0_4:import3.CollectionPage;
  constructor(viewUtils:import4.ViewUtils,parentInjector:import5.Injector,declarationEl:import2.AppElement) {
    super(_View_CollectionPage_Host0,renderType_CollectionPage_Host,import6.ViewType.HOST,viewUtils,parentInjector,declarationEl,import7.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    this._el_0 = this.selectOrCreateHostElement('page-collection',rootSelector,(null as any));
    this._appEl_0 = new import2.AppElement(0,(null as any),this,this._el_0);
    var compView_0:any = viewFactory_CollectionPage0(this.viewUtils,this.injector(0),this._appEl_0);
    this._CollectionPage_0_4 = new import3.CollectionPage(this.parentInjector.get(import8.NavController));
    this._appEl_0.initComponent(this._CollectionPage_0_4,[],compView_0);
    compView_0.create(this._CollectionPage_0_4,this.projectableNodes,(null as any));
    this.init([].concat([this._el_0]),[this._el_0],[],[]);
    return this._appEl_0;
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import3.CollectionPage) && (0 === requestNodeIndex))) { return this._CollectionPage_0_4; }
    return notFoundResult;
  }
}
function viewFactory_CollectionPage_Host0(viewUtils:import4.ViewUtils,parentInjector:import5.Injector,declarationEl:import2.AppElement):import1.AppView<any> {
  if ((renderType_CollectionPage_Host === (null as any))) { (renderType_CollectionPage_Host = viewUtils.createRenderComponentType('',0,import9.ViewEncapsulation.None,[],{})); }
  return new _View_CollectionPage_Host0(viewUtils,parentInjector,declarationEl);
}
export const CollectionPageNgFactory:import10.ComponentFactory<import3.CollectionPage> = new import10.ComponentFactory<import3.CollectionPage>('page-collection',viewFactory_CollectionPage_Host0,import3.CollectionPage);
const styles_CollectionPage:any[] = [];
var renderType_CollectionPage:import0.RenderComponentType = (null as any);
class _View_CollectionPage0 extends import1.AppView<import3.CollectionPage> {
  _text_0:any;
  _el_1:any;
  _Header_1_3:import11.Header;
  _text_2:any;
  _el_3:any;
  /*private*/ _appEl_3:import2.AppElement;
  _Navbar_3_4:import12.Navbar;
  _text_4:any;
  _el_5:any;
  /*private*/ _appEl_5:import2.AppElement;
  _ToolbarTitle_5_4:import13.ToolbarTitle;
  _text_6:any;
  _text_7:any;
  _el_8:any;
  _ToolbarItem_8_3:import14.ToolbarItem;
  _query_Button_8_0:import15.QueryList<any>;
  _text_9:any;
  _el_10:any;
  /*private*/ _appEl_10:import2.AppElement;
  _Button_10_4:import16.Button;
  _el_11:any;
  _Icon_11_3:import17.Icon;
  _text_12:any;
  _text_13:any;
  _text_14:any;
  _el_15:any;
  /*private*/ _appEl_15:import2.AppElement;
  _Toolbar_15_4:import11.Toolbar;
  _text_16:any;
  _el_17:any;
  /*private*/ _appEl_17:import2.AppElement;
  _Searchbar_17_4:import18.Searchbar;
  _text_18:any;
  _text_19:any;
  _text_20:any;
  _el_21:any;
  /*private*/ _appEl_21:import2.AppElement;
  _Content_21_4:import19.Content;
  _text_22:any;
  _el_23:any;
  _text_24:any;
  _anchor_25:any;
  /*private*/ _appEl_25:import2.AppElement;
  _TemplateRef_25_5:any;
  _NgFor_25_6:import20.NgFor;
  _text_26:any;
  _text_27:any;
  /*private*/ _expr_0:any;
  /*private*/ _expr_1:any;
  /*private*/ _expr_2:any;
  /*private*/ _expr_3:any;
  /*private*/ _expr_4:any;
  /*private*/ _expr_5:any;
  /*private*/ _expr_6:any;
  /*private*/ _expr_7:any;
  /*private*/ _expr_8:any;
  /*private*/ _expr_9:any;
  /*private*/ _expr_10:any;
  /*private*/ _expr_11:any;
  constructor(viewUtils:import4.ViewUtils,parentInjector:import5.Injector,declarationEl:import2.AppElement) {
    super(_View_CollectionPage0,renderType_CollectionPage,import6.ViewType.COMPONENT,viewUtils,parentInjector,declarationEl,import7.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    const parentRenderNode:any = this.renderer.createViewRoot(this.declarationAppElement.nativeElement);
    this._text_0 = this.renderer.createText(parentRenderNode,'\n',(null as any));
    this._el_1 = this.renderer.createElement(parentRenderNode,'ion-header',(null as any));
    this._Header_1_3 = new import11.Header(this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_1),this.renderer,this.parentInjector.get(import23.ViewController,(null as any)));
    this._text_2 = this.renderer.createText(this._el_1,'\n\n  ',(null as any));
    this._el_3 = this.renderer.createElement(this._el_1,'ion-navbar',(null as any));
    this.renderer.setElementAttribute(this._el_3,'class','toolbar');
    this._appEl_3 = new import2.AppElement(3,1,this,this._el_3);
    var compView_3:any = import24.viewFactory_Navbar0(this.viewUtils,this.injector(3),this._appEl_3);
    this._Navbar_3_4 = new import12.Navbar(this.parentInjector.get(import25.App),this.parentInjector.get(import23.ViewController,(null as any)),this.parentInjector.get(import8.NavController,(null as any)),this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_3),this.renderer);
    this._appEl_3.initComponent(this._Navbar_3_4,[],compView_3);
    this._text_4 = this.renderer.createText((null as any),'\n    ',(null as any));
    this._el_5 = this.renderer.createElement((null as any),'ion-title',(null as any));
    this._appEl_5 = new import2.AppElement(5,3,this,this._el_5);
    var compView_5:any = import26.viewFactory_ToolbarTitle0(this.viewUtils,this.injector(5),this._appEl_5);
    this._ToolbarTitle_5_4 = new import13.ToolbarTitle(this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_5),this.renderer,this.parentInjector.get(import11.Toolbar,(null as any)),this._Navbar_3_4);
    this._appEl_5.initComponent(this._ToolbarTitle_5_4,[],compView_5);
    this._text_6 = this.renderer.createText((null as any),'Collection',(null as any));
    compView_5.create(this._ToolbarTitle_5_4,[[].concat([this._text_6])],(null as any));
    this._text_7 = this.renderer.createText((null as any),'\n    ',(null as any));
    this._el_8 = this.renderer.createElement((null as any),'ion-buttons',(null as any));
    this.renderer.setElementAttribute(this._el_8,'end','');
    this._ToolbarItem_8_3 = new import14.ToolbarItem(this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_8),this.renderer,this.parentInjector.get(import11.Toolbar,(null as any)),this._Navbar_3_4);
    this._query_Button_8_0 = new import15.QueryList<any>();
    this._text_9 = this.renderer.createText(this._el_8,'\n      ',(null as any));
    this._el_10 = this.renderer.createElement(this._el_8,'button',(null as any));
    this.renderer.setElementAttribute(this._el_10,'icon-only','');
    this.renderer.setElementAttribute(this._el_10,'ion-button','');
    this._appEl_10 = new import2.AppElement(10,8,this,this._el_10);
    var compView_10:any = import27.viewFactory_Button0(this.viewUtils,this.injector(10),this._appEl_10);
    this._Button_10_4 = new import16.Button((null as any),'',this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_10),this.renderer);
    this._appEl_10.initComponent(this._Button_10_4,[],compView_10);
    this._el_11 = this.renderer.createElement((null as any),'ion-icon',(null as any));
    this.renderer.setElementAttribute(this._el_11,'name','funnel');
    this.renderer.setElementAttribute(this._el_11,'role','img');
    this._Icon_11_3 = new import17.Icon(this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_11),this.renderer);
    compView_10.create(this._Button_10_4,[[].concat([this._el_11])],(null as any));
    this._text_12 = this.renderer.createText(this._el_8,'\n    ',(null as any));
    this._text_13 = this.renderer.createText((null as any),'\n  ',(null as any));
    compView_3.create(this._Navbar_3_4,[
      [],
      [],
      [].concat([this._el_8]),
      [].concat([
        this._text_4,
        this._el_5,
        this._text_7,
        this._text_13
      ]
      )
    ]
    ,(null as any));
    this._text_14 = this.renderer.createText(this._el_1,'\n  ',(null as any));
    this._el_15 = this.renderer.createElement(this._el_1,'ion-toolbar',(null as any));
    this.renderer.setElementAttribute(this._el_15,'class','toolbar');
    this._appEl_15 = new import2.AppElement(15,1,this,this._el_15);
    var compView_15:any = import28.viewFactory_Toolbar0(this.viewUtils,this.injector(15),this._appEl_15);
    this._Toolbar_15_4 = new import11.Toolbar(this.parentInjector.get(import23.ViewController,(null as any)),this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_15),this.renderer);
    this._appEl_15.initComponent(this._Toolbar_15_4,[],compView_15);
    this._text_16 = this.renderer.createText((null as any),'\n    ',(null as any));
    this._el_17 = this.renderer.createElement((null as any),'ion-searchbar',(null as any));
    this._appEl_17 = new import2.AppElement(17,15,this,this._el_17);
    var compView_17:any = import29.viewFactory_Searchbar0(this.viewUtils,this.injector(17),this._appEl_17);
    this._Searchbar_17_4 = new import18.Searchbar(this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_17),this.renderer,this.parentInjector.get(import30.NgControl,(null as any)));
    this._appEl_17.initComponent(this._Searchbar_17_4,[],compView_17);
    compView_17.create(this._Searchbar_17_4,[],(null as any));
    this._text_18 = this.renderer.createText((null as any),'\n  ',(null as any));
    compView_15.create(this._Toolbar_15_4,[
      [],
      [],
      [],
      [].concat([
        this._text_16,
        this._el_17,
        this._text_18
      ]
      )
    ]
    ,(null as any));
    this._text_19 = this.renderer.createText(this._el_1,'\n\n',(null as any));
    this._text_20 = this.renderer.createText(parentRenderNode,'\n\n\n',(null as any));
    this._el_21 = this.renderer.createElement(parentRenderNode,'ion-content',(null as any));
    this.renderer.setElementAttribute(this._el_21,'padding','');
    this._appEl_21 = new import2.AppElement(21,(null as any),this,this._el_21);
    var compView_21:any = import31.viewFactory_Content0(this.viewUtils,this.injector(21),this._appEl_21);
    this._Content_21_4 = new import19.Content(this.parentInjector.get(import21.Config),new import22.ElementRef(this._el_21),this.renderer,this.parentInjector.get(import25.App),this.parentInjector.get(import32.Keyboard),this.parentInjector.get(import33.NgZone),this.parentInjector.get(import23.ViewController,(null as any)),this.parentInjector.get(import34.Tabs,(null as any)));
    this._appEl_21.initComponent(this._Content_21_4,[],compView_21);
    this._text_22 = this.renderer.createText((null as any),'\n  ',(null as any));
    this._el_23 = this.renderer.createElement((null as any),'div',(null as any));
    this.renderer.setElementAttribute(this._el_23,'class','items');
    this._text_24 = this.renderer.createText(this._el_23,'\n    ',(null as any));
    this._anchor_25 = this.renderer.createTemplateAnchor(this._el_23,(null as any));
    this._appEl_25 = new import2.AppElement(25,23,this,this._anchor_25);
    this._TemplateRef_25_5 = new import35.TemplateRef_(this._appEl_25,viewFactory_CollectionPage1);
    this._NgFor_25_6 = new import20.NgFor(this._appEl_25.vcRef,this._TemplateRef_25_5,this.parentInjector.get(import36.IterableDiffers),this.ref);
    this._text_26 = this.renderer.createText(this._el_23,'\n  ',(null as any));
    this._text_27 = this.renderer.createText((null as any),'\n',(null as any));
    compView_21.create(this._Content_21_4,[
      [],
      [].concat([
        this._text_22,
        this._el_23,
        this._text_27
      ]
      ),
      []
    ]
    ,(null as any));
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
    this.init([],[
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
    ]
    ,[],[]);
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import13.ToolbarTitle) && ((5 <= requestNodeIndex) && (requestNodeIndex <= 6)))) { return this._ToolbarTitle_5_4; }
    if (((token === import17.Icon) && (11 === requestNodeIndex))) { return this._Icon_11_3; }
    if (((token === import16.Button) && ((10 <= requestNodeIndex) && (requestNodeIndex <= 11)))) { return this._Button_10_4; }
    if (((token === import14.ToolbarItem) && ((8 <= requestNodeIndex) && (requestNodeIndex <= 12)))) { return this._ToolbarItem_8_3; }
    if (((token === import12.Navbar) && ((3 <= requestNodeIndex) && (requestNodeIndex <= 13)))) { return this._Navbar_3_4; }
    if (((token === import18.Searchbar) && (17 === requestNodeIndex))) { return this._Searchbar_17_4; }
    if (((token === import11.Toolbar) && ((15 <= requestNodeIndex) && (requestNodeIndex <= 18)))) { return this._Toolbar_15_4; }
    if (((token === import11.Header) && ((1 <= requestNodeIndex) && (requestNodeIndex <= 19)))) { return this._Header_1_3; }
    if (((token === import35.TemplateRef) && (25 === requestNodeIndex))) { return this._TemplateRef_25_5; }
    if (((token === import20.NgFor) && (25 === requestNodeIndex))) { return this._NgFor_25_6; }
    if (((token === import19.Content) && ((21 <= requestNodeIndex) && (requestNodeIndex <= 27)))) { return this._Content_21_4; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    var changes:{[key: string]:import7.SimpleChange} = (null as any);
    const currVal_2:any = 'funnel';
    if (import4.checkBinding(throwOnChange,this._expr_2,currVal_2)) {
      this._Icon_11_3.name = currVal_2;
      this._expr_2 = currVal_2;
    }
    if (((this.numberOfChecks === 0) && !throwOnChange)) { this._Searchbar_17_4.ngOnInit(); }
    if (((this.numberOfChecks === 0) && !throwOnChange)) { this._Content_21_4.ngOnInit(); }
    changes = (null as any);
    const currVal_11:any = this.context.localMatrices;
    if (import4.checkBinding(throwOnChange,this._expr_11,currVal_11)) {
      this._NgFor_25_6.ngForOf = currVal_11;
      if ((changes === (null as any))) { (changes = {}); }
      changes['ngForOf'] = new import7.SimpleChange(this._expr_11,currVal_11);
      this._expr_11 = currVal_11;
    }
    if ((changes !== (null as any))) { this._NgFor_25_6.ngOnChanges(changes); }
    if (!throwOnChange) { this._NgFor_25_6.ngDoCheck(); }
    this.detectContentChildrenChanges(throwOnChange);
    if (!throwOnChange) {
      if (this._query_Button_8_0.dirty) {
        this._query_Button_8_0.reset([this._Button_10_4]);
        this._ToolbarItem_8_3._buttons = this._query_Button_8_0;
        this._query_Button_8_0.notifyOnChanges();
      }
      if ((this.numberOfChecks === 0)) { this._Button_10_4.ngAfterContentInit(); }
    }
    const currVal_0:any = this._Navbar_3_4._hidden;
    if (import4.checkBinding(throwOnChange,this._expr_0,currVal_0)) {
      this.renderer.setElementProperty(this._el_3,'hidden',currVal_0);
      this._expr_0 = currVal_0;
    }
    const currVal_1:any = this._Navbar_3_4._sbPadding;
    if (import4.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementClass(this._el_3,'statusbar-padding',currVal_1);
      this._expr_1 = currVal_1;
    }
    const currVal_3:any = this._Icon_11_3._hidden;
    if (import4.checkBinding(throwOnChange,this._expr_3,currVal_3)) {
      this.renderer.setElementClass(this._el_11,'hide',currVal_3);
      this._expr_3 = currVal_3;
    }
    const currVal_4:any = this._Toolbar_15_4._sbPadding;
    if (import4.checkBinding(throwOnChange,this._expr_4,currVal_4)) {
      this.renderer.setElementClass(this._el_15,'statusbar-padding',currVal_4);
      this._expr_4 = currVal_4;
    }
    const currVal_5:any = this._Searchbar_17_4._value;
    if (import4.checkBinding(throwOnChange,this._expr_5,currVal_5)) {
      this.renderer.setElementClass(this._el_17,'searchbar-has-value',currVal_5);
      this._expr_5 = currVal_5;
    }
    const currVal_6:any = this._Searchbar_17_4._isActive;
    if (import4.checkBinding(throwOnChange,this._expr_6,currVal_6)) {
      this.renderer.setElementClass(this._el_17,'searchbar-active',currVal_6);
      this._expr_6 = currVal_6;
    }
    const currVal_7:any = this._Searchbar_17_4.showCancelButton;
    if (import4.checkBinding(throwOnChange,this._expr_7,currVal_7)) {
      this.renderer.setElementClass(this._el_17,'searchbar-show-cancel',currVal_7);
      this._expr_7 = currVal_7;
    }
    const currVal_8:any = this._Searchbar_17_4.shouldAlignLeft();
    if (import4.checkBinding(throwOnChange,this._expr_8,currVal_8)) {
      this.renderer.setElementClass(this._el_17,'searchbar-left-aligned',currVal_8);
      this._expr_8 = currVal_8;
    }
    const currVal_9:any = this._Searchbar_17_4._sbHasFocus;
    if (import4.checkBinding(throwOnChange,this._expr_9,currVal_9)) {
      this.renderer.setElementClass(this._el_17,'searchbar-has-focus',currVal_9);
      this._expr_9 = currVal_9;
    }
    const currVal_10:any = this._Content_21_4._sbPadding;
    if (import4.checkBinding(throwOnChange,this._expr_10,currVal_10)) {
      this.renderer.setElementClass(this._el_21,'statusbar-padding',currVal_10);
      this._expr_10 = currVal_10;
    }
    this.detectViewChildrenChanges(throwOnChange);
    if (!throwOnChange) {
      if ((this.numberOfChecks === 0)) { this._Navbar_3_4.ngAfterViewInit(); }
      this._Searchbar_17_4.ngAfterViewChecked();
    }
  }
  destroyInternal():void {
    this._Icon_11_3.ngOnDestroy();
    this._Content_21_4.ngOnDestroy();
  }
}
export function viewFactory_CollectionPage0(viewUtils:import4.ViewUtils,parentInjector:import5.Injector,declarationEl:import2.AppElement):import1.AppView<import3.CollectionPage> {
  if ((renderType_CollectionPage === (null as any))) { (renderType_CollectionPage = viewUtils.createRenderComponentType('d:/git/sportspip/.tmp/pages/collection/collection.html',0,import9.ViewEncapsulation.None,styles_CollectionPage,{})); }
  return new _View_CollectionPage0(viewUtils,parentInjector,declarationEl);
}
class _View_CollectionPage1 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  _el_2:any;
  _Card_2_3:import37.Card;
  _text_3:any;
  _el_4:any;
  _text_5:any;
  _el_6:any;
  _CardContent_6_3:import37.CardContent;
  _text_7:any;
  _el_8:any;
  _CardTitle_8_3:import37.CardTitle;
  _text_9:any;
  _el_10:any;
  _Row_10_3:import38.Row;
  _text_11:any;
  _el_12:any;
  _Col_12_3:import38.Col;
  _text_13:any;
  _el_14:any;
  _text_15:any;
  _text_16:any;
  _text_17:any;
  _el_18:any;
  _Col_18_3:import38.Col;
  _text_19:any;
  _el_20:any;
  _text_21:any;
  _text_22:any;
  _text_23:any;
  _text_24:any;
  _text_25:any;
  _el_26:any;
  _text_27:any;
  _el_28:any;
  _text_29:any;
  _text_30:any;
  _el_31:any;
  _text_32:any;
  _text_33:any;
  _text_34:any;
  _text_35:any;
  _text_36:any;
  /*private*/ _expr_1:any;
  /*private*/ _expr_2:any;
  constructor(viewUtils:import4.ViewUtils,parentInjector:import5.Injector,declarationEl:import2.AppElement) {
    super(_View_CollectionPage1,renderType_CollectionPage,import6.ViewType.EMBEDDED,viewUtils,parentInjector,declarationEl,import7.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import2.AppElement {
    this._el_0 = this.renderer.createElement((null as any),'div',(null as any));
    this.renderer.setElementAttribute(this._el_0,'class','item');
    this._text_1 = this.renderer.createText(this._el_0,'\n      ',(null as any));
    this._el_2 = this.renderer.createElement(this._el_0,'ion-card',(null as any));
    this._Card_2_3 = new import37.Card(this.parent.parentInjector.get(import21.Config),new import22.ElementRef(this._el_2),this.renderer);
    this._text_3 = this.renderer.createText(this._el_2,'\n        ',(null as any));
    this._el_4 = this.renderer.createElement(this._el_2,'img',(null as any));
    this._text_5 = this.renderer.createText(this._el_2,'\n        ',(null as any));
    this._el_6 = this.renderer.createElement(this._el_2,'ion-card-content',(null as any));
    this._CardContent_6_3 = new import37.CardContent();
    this._text_7 = this.renderer.createText(this._el_6,'\n          ',(null as any));
    this._el_8 = this.renderer.createElement(this._el_6,'ion-card-title',(null as any));
    this.renderer.setElementAttribute(this._el_8,'style','font-size:18px;flex-wrap: nowrap;');
    this._CardTitle_8_3 = new import37.CardTitle();
    this._text_9 = this.renderer.createText(this._el_8,'\n            ',(null as any));
    this._el_10 = this.renderer.createElement(this._el_8,'ion-row',(null as any));
    this._Row_10_3 = new import38.Row();
    this._text_11 = this.renderer.createText(this._el_10,'\n              ',(null as any));
    this._el_12 = this.renderer.createElement(this._el_10,'ion-col',(null as any));
    this._Col_12_3 = new import38.Col();
    this._text_13 = this.renderer.createText(this._el_12,'\n                ',(null as any));
    this._el_14 = this.renderer.createElement(this._el_12,'div',(null as any));
    this.renderer.setElementAttribute(this._el_14,'style','text-overflow:ellipsis;');
    this._text_15 = this.renderer.createText(this._el_14,'',(null as any));
    this._text_16 = this.renderer.createText(this._el_12,'\n              ',(null as any));
    this._text_17 = this.renderer.createText(this._el_10,'\n              ',(null as any));
    this._el_18 = this.renderer.createElement(this._el_10,'ion-col',(null as any));
    this.renderer.setElementAttribute(this._el_18,'center','');
    this.renderer.setElementAttribute(this._el_18,'style','width:10px;');
    this.renderer.setElementAttribute(this._el_18,'text-right','');
    this._Col_18_3 = new import38.Col();
    this._text_19 = this.renderer.createText(this._el_18,'\n                ',(null as any));
    this._el_20 = this.renderer.createElement(this._el_18,'p',(null as any));
    this._text_21 = this.renderer.createText(this._el_20,'Oct 3',(null as any));
    this._text_22 = this.renderer.createText(this._el_18,'\n              ',(null as any));
    this._text_23 = this.renderer.createText(this._el_10,'\n            ',(null as any));
    this._text_24 = this.renderer.createText(this._el_8,'\n          ',(null as any));
    this._text_25 = this.renderer.createText(this._el_6,'\n          ',(null as any));
    this._el_26 = this.renderer.createElement(this._el_6,'div',(null as any));
    this.renderer.setElementAttribute(this._el_26,'style','display:block;');
    this._text_27 = this.renderer.createText(this._el_26,'\n            ',(null as any));
    this._el_28 = this.renderer.createElement(this._el_26,'p',(null as any));
    this._text_29 = this.renderer.createText(this._el_28,'Sport/Skill',(null as any));
    this._text_30 = this.renderer.createText(this._el_26,'\n            ',(null as any));
    this._el_31 = this.renderer.createElement(this._el_26,'p',(null as any));
    this._text_32 = this.renderer.createText(this._el_31,'00:00',(null as any));
    this._text_33 = this.renderer.createText(this._el_26,'\n          ',(null as any));
    this._text_34 = this.renderer.createText(this._el_6,'\n        ',(null as any));
    this._text_35 = this.renderer.createText(this._el_2,'\n      ',(null as any));
    this._text_36 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    var disposable_0:Function = this.renderer.listen(this._el_2,'click',this.eventHandler(this._handle_click_2_0.bind(this)));
    this._expr_1 = import7.UNINITIALIZED;
    this._expr_2 = import7.UNINITIALIZED;
    this.init([].concat([this._el_0]),[
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
    ]
    ,[disposable_0],[]);
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import38.Col) && ((12 <= requestNodeIndex) && (requestNodeIndex <= 16)))) { return this._Col_12_3; }
    if (((token === import38.Col) && ((18 <= requestNodeIndex) && (requestNodeIndex <= 22)))) { return this._Col_18_3; }
    if (((token === import38.Row) && ((10 <= requestNodeIndex) && (requestNodeIndex <= 23)))) { return this._Row_10_3; }
    if (((token === import37.CardTitle) && ((8 <= requestNodeIndex) && (requestNodeIndex <= 24)))) { return this._CardTitle_8_3; }
    if (((token === import37.CardContent) && ((6 <= requestNodeIndex) && (requestNodeIndex <= 34)))) { return this._CardContent_6_3; }
    if (((token === import37.Card) && ((2 <= requestNodeIndex) && (requestNodeIndex <= 35)))) { return this._Card_2_3; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this.detectContentChildrenChanges(throwOnChange);
    const currVal_1:any = this.context.$implicit.image;
    if (import4.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementProperty(this._el_4,'src',this.viewUtils.sanitizer.sanitize(import39.SecurityContext.URL,currVal_1));
      this._expr_1 = currVal_1;
    }
    const currVal_2:any = import4.interpolate(1,'',this.context.$implicit.title,'');
    if (import4.checkBinding(throwOnChange,this._expr_2,currVal_2)) {
      this.renderer.setText(this._text_15,currVal_2);
      this._expr_2 = currVal_2;
    }
    this.detectViewChildrenChanges(throwOnChange);
  }
  private _handle_click_2_0($event:any):boolean {
    this.markPathToRootAsCheckOnce();
    const pd_0:any = ((<any>this.parent.context.openMatrix(this.context.$implicit.title)) !== false);
    return (true && pd_0);
  }
}
function viewFactory_CollectionPage1(viewUtils:import4.ViewUtils,parentInjector:import5.Injector,declarationEl:import2.AppElement):import1.AppView<any> {
  return new _View_CollectionPage1(viewUtils,parentInjector,declarationEl);
}