import { ShippingExtensionContext, Logger } from '@kibocommerce/shipping-extensibility-host'
import { downloadImageToBase64 } from './util'
import get from 'lodash.get'

export default class ResponseTransformers {
  context: ShippingExtensionContext
  logger: Logger
  constructor(context: ShippingExtensionContext, logger: Logger) {
    this.context = context
    this.logger = logger
  }
  async getRatesResponse(request: any, externalResponse: any) {
    const carrierId = this.context.carrierId
    const shippingRates = get(externalResponse, 'rates', []).map((method: any) => ({
      code: `${carrierId}_${method.service}_${method.carrier}`,
      amount: parseFloat(method.rate),
      shippingItemRates: [],
      customAttributes: [],
    }))
    return { carrierId, shippingRates, customAttributes: [] }
  }
  async getLabelsResponse(request: any, externalResponse: any) {
    const packageResponses: any[] = []
    const response = {
      packageResponses,
      shippingTotal: { currencyCode: 'USD', value: 9.99 },
      customAttributes: [],
      messages: [],
      isSuccessful: true,
      trackingNumber: null,
    }
    const packageId = request.shipment?.packages?.[0] || ''
    const shipments = externalResponse?.shipments || []
    for (const shipment of shipments) {
      let imageData = ''
      if (shipment?.postage_label?.label_url) {
        imageData = await downloadImageToBase64(shipment?.postage_label?.label_url)
      }
      const shippingPackage = {
        id: packageId,
        trackingNumber: shipment.tracking_code,
        integratorId: shipment.id,
        label: {
          imageData,
          imageFormat: shipment?.postage_label?.label_file_type,
          labelUrl: shipment?.postage_label?.label_url,
        },
        customAttributes: [],
      }
      if (!response.trackingNumber) {
        response.trackingNumber = shipment.tracking_code
      }
      packageResponses.push(shippingPackage)
    }
    return response
  }
  async getManifestResponse(request: any, externalResponse: any) {
    return {
      manifestId: externalResponse?.id,
      manifestUrl: externalResponse?.form_url,
      carrierId: this.context.carrierId,
      locationCode: request.locationCode,
      includedShipments: request.includedShipments, // Just copy the list back
      messages: [],
      isSuccessful: !!externalResponse?.id,
    }
  }
  async getManifestUrlResponse(request: any, externalResponse: any) {
    return externalResponse?.form_url
  }
  async cancelLabelsResponse(request: any, externalResponse: any) {
    const labelStatus =
      externalResponse?.map(({ id, status }: { id: string; status: string }) => ({
        integratorId: id,
        refundStatus: status,
      })) || []
    return {
      labelStatus,
      messages: [],
      isSuccessful: true,
    }
  }
}
