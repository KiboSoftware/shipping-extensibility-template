import { CustomShippingAdapter } from './CustomShippingAdapter'
import type { CustomAdapterSettings } from './types'
import type {
  ShippingExtensionFactory,
  ShippingExtensionAdapter,
  ShippingExtensionContext,
  Logger,
} from '@kibocommerce/shipping-extensibility-host'
import ResponseTransformers from './service/ResponseTransformers'
import ShippingService from './service/ShippingService'
export class CustomAdapterFactory implements ShippingExtensionFactory {
  settings?: CustomAdapterSettings
  constructor(settings?: CustomAdapterSettings) {
    this.settings = settings
  }
  createAdapter(context: ShippingExtensionContext, logger: Logger): ShippingExtensionAdapter {
    const shippingService = new ShippingService(context, logger)
    const transformers = new ResponseTransformers(context, logger)
    return new CustomShippingAdapter(context, logger, shippingService, transformers, this.settings)
  }
}
