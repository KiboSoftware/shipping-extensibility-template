import type {
  ShippingExtensionAdapter,
  ShippingExtensionContext,
  Logger,
} from '@kibocommerce/shipping-extensibility-host'

import type { CustomAdapterSettings } from './types'
export class CustomShippingAdapter implements ShippingExtensionAdapter {
  context: ShippingExtensionContext
  logger: Logger
  settings?: CustomAdapterSettings
  constructor(context: ShippingExtensionContext, logger: Logger, settings?: CustomAdapterSettings) {
    this.context = context
    this.logger = logger
    this.settings = settings
  }
  async getRates(request: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async getLabels(request: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async getManifest(request: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async getManifestUrl(request: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async cancelLabels(request: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
