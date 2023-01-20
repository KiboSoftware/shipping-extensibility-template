import type {
  ShippingExtensionAdapter,
  ShippingExtensionContext,
  Logger,
} from '@kibocommerce/shipping-extensibility-host'

import type { CustomAdapterSettings } from './types'
import type { CarrierService } from './service/ShippingService'

export class CustomShippingAdapter implements ShippingExtensionAdapter {
  context: ShippingExtensionContext
  logger: Logger
  settings?: CustomAdapterSettings
  service: CarrierService
  transformers: any
  constructor(
    context: ShippingExtensionContext,
    logger: Logger,
    service: CarrierService,
    transformers: any,
    settings?: CustomAdapterSettings
  ) {
    this.context = context
    this.logger = logger
    this.settings = settings
    this.service = service
    this.transformers = transformers
  }
  async getRates(request: any): Promise<any> {
    try {
      const carrierResponse = await this.service.getRates(request.request)
      return await this.transformers.getRatesResponse(request, carrierResponse)
    } catch (error) {
      this.logger.error(error)
      throw new Error('Unable to get rates')
    }
  }
  async getLabels(request: any): Promise<any> {
    try {
      const isReturn = request.shipmentRequestType === 'Return'
      const serviceOperation = isReturn ? this.service.getLabels : this.service.getReturnLabels
      const carrierResponse = await serviceOperation(request)
      return await this.transformers.getLabelsResponse(request, carrierResponse)
    } catch (error) {
      this.logger.error(error)
      throw new Error('Unable to get labels')
    }
  }
  async getManifest(request: any): Promise<any> {
    try {
      const carrierResponse = await this.service.getManifest(request)
      return await this.transformers.getManifestResponse(request, carrierResponse)
    } catch (error) {
      this.logger.error(error)
      throw new Error('Unable to get manifest')
    }
  }
  async getManifestUrl(request: any): Promise<any> {
    try {
      const carrierResponse = await this.service.getManifestUrl(request)
      return await this.transformers.getManifestUrlResponse(request, carrierResponse)
    } catch (error) {
      this.logger.error(error)
      throw new Error('Unable to get manifest url')
    }
  }
  async cancelLabels(request: any): Promise<any> {
    try {
      const carrierResponse = await this.service.cancelLabels(request)
      return await this.transformers.cancelLabelsResponse(request, carrierResponse)
    } catch (error) {
      this.logger.error(error)
      throw new Error('Unable to cancel labels')
    }
  }
}
