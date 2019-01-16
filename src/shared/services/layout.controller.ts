import { Injectable } from '@angular/core';
import { LayoutConfig } from "./layout-config";
import { LayoutConfigHistory } from "./layout-config-history";

@Injectable()
export class LayoutController {

  constructor(private layoutConfigHistory: LayoutConfigHistory,
              private layoutConfig: LayoutConfig) {
  }

  public configure(config, pushToStack = true) {
    // timeout prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.layoutConfig.set(config);

      if (pushToStack) {
        this.layoutConfigHistory.push(this.layoutConfig.get());
      }
    }, 0);
  }
}
