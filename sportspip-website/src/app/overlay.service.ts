import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { OverlayHandle } from './overlay-handle';
import { OverlayComponent } from './overlay/overlay.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<R = any, T = any>(
    content: string | TemplateRef<any> | Type<any>,
    data: T
  ): OverlayHandle<R> {
    const configs = new OverlayConfig({
      hasBackdrop: true,
      panelClass: ['modal', 'is-active'],
      backdropClass: 'modal-background'
    });

    const overlayRef = this.overlay.create(configs);

    const overlayHandle = new OverlayHandle<R, T>(overlayRef, content, data);

    const injector = this.createInjector(overlayHandle, this.injector);
    overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));

    return overlayHandle;
  }

  createInjector(ref: OverlayHandle, inj: Injector) {
    const injectorTokens = new WeakMap([[OverlayHandle, ref]]);
    return new PortalInjector(inj, injectorTokens);
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class OverlayService {

//   constructor() { }
// }
