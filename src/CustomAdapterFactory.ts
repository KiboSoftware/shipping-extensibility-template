import { CustomShippingAdapter } from './CustomShippingAdapter'
import type { CustomAdapterSettings } from './types'
import type {
  ShippingExtensionFactory,
  ShippingExtensionAdapter,
  ShippingExtensionContext,
  Logger,
} from '@kibocommerce/shipping-extensibility-host'
export class CustomAdapterFactory implements ShippingExtensionFactory {
  settings?: CustomAdapterSettings
  constructor(settings?: CustomAdapterSettings) {
    this.settings = settings
  }
  createAdapter(context: ShippingExtensionContext, logger: Logger): ShippingExtensionAdapter {
    return new CustomShippingAdapter(context, logger, this.settings)
  }
}
