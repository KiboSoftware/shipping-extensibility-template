import host from '@kibocommerce/shipping-extensibility-host'
import { CustomAdapterFactory } from './CustomAdapterFactory'
import config from './Config'

const settings = config.get('settings')
const factory = new CustomAdapterFactory(settings)

host(factory)
