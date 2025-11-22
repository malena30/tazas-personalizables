import { useContext } from 'react'
import { CheckoutContext } from '../../context/CheckoutContext'

export function useCheckout() {
  return useContext(CheckoutContext)
}
