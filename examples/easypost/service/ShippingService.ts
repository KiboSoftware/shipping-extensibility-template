import EasyPost from '@easypost/api'
import type { ShippingExtensionAdapter } from '@kibocommerce/shipping-extensibility-host'
import get from 'lodash.get'

export interface CarrierService extends ShippingExtensionAdapter {
  getReturnLabels(request: any): Promise<any>
}
const transformers = {
  toEasyPostAddress: (kiboAddress: any) => ({
    company: '',
    name: '',
    street1: kiboAddress.address1,
    street2: kiboAddress.address2,
    city: kiboAddress.cityOrTown,
    state: kiboAddress.stateOrProvince,
    zip: kiboAddress.postalOrZipCode,
    phone: '',
    country: kiboAddress.countryCode,
  }),
  // obvi not complete for parcel building
  itemsToParcel: (kiboItems = []) =>
    kiboItems.reduce(
      (accum, item) => {
        accum.weight += get(item, 'unitMeasurements.weight.value', 0)
        return accum
      },
      { weight: 0 }
    ),
  packagesToParcel: (packages = []) =>
    packages.reduce(
      (accum, item) => {
        accum.weight += get(item, 'measurements.weight.value', 0)
        return accum
      },
      { weight: 0 }
    ),
}

export default class ShippingService implements CarrierService {
  easyPostSDK: any
  logger: any
  context: any
  constructor(context: any, logger: any) {
    const apiKey = context.credentials?.find((cred: any) => cred.key === 'apiKey')?.value
    if (!apiKey) {
      throw new Error('EasyPost api key required.')
    }
    this.easyPostSDK = new EasyPost(apiKey)
    this.logger = logger
  }
  async getRates(ratesRequest: any) {
    return await this._createShipment(ratesRequest)
  }
  async getLabels(shipmentRequest: any) {
    const shipment = await this._createShipment(shipmentRequest)
    const serviceType = shipmentRequest.shippingServiceType
    const rateToPick = shipment.rates.find(
      (rate: { service: string }) => rate.service.toLowerCase() == serviceType.toLowerCase()
    )
    if (!rateToPick) {
      throw new Error(`Unable to get label for ${serviceType}`)
    }
    return await shipment.buy(rateToPick.id)
  }
  async getReturnLabels(shipmentRequest: any) {
    const { origin, destination, ...requestDetails } = shipmentRequest
    const returnLabelRequest = {
      origin: destination,
      destination: origin,
      ...requestDetails,
    }
    return this.getLabels(returnLabelRequest)
  }
  async getManifest(request: any) {
    const shipments = request.integratorIds.map((id: string) => ({ id }))
    const scanForm = new this.easyPostSDK.ScanForm({ shipments })
    const manifest = await scanForm.save()
    if (!manifest) {
      throw new Error(`Failed to create manifest`)
    }
    return manifest
  }
  async getManifestUrl(request: any) {
    const scanForm = new this.easyPostSDK.ScanForm()
    const manifest = await scanForm.retrieve(request.manifestId)
    if (!manifest || !manifest?.form_url) {
      throw new Error(`Unable to locate manifest`)
    }
    return manifest
  }
  async cancelLabels(request: any): Promise<Array<{ id: string; status: string }>> {
    const refundResults: Array<{ id: string; status: string }> = []
    const { integratorIds }: { integratorIds: string[] } = request
    for (const id of integratorIds) {
      const shipment = new this.easyPostSDK.Shipment({ id })
      const { status } = await shipment.refund()
      refundResults.push({ id, status })
    }
    return refundResults
  }
  async _createShipment(request: any) {
    const shipment = this._buildShipment(request)
    return await shipment.save()
  }
  _buildShipment(request: {
    originAddress: any
    origin: any
    destinationAddress: any
    destination: any
    packages: never[] | undefined
    items: never[] | undefined
  }) {
    const origin = request.originAddress || request.origin
    const destination = request.destinationAddress || request.destination
    const parcel = request.packages
      ? transformers.packagesToParcel(request.packages)
      : transformers.itemsToParcel(request.items)
    return new this.easyPostSDK.Shipment({
      from_address: transformers.toEasyPostAddress(origin),
      to_address: transformers.toEasyPostAddress(destination),
      parcel: parcel,
    })
  }
}
