"use client";

import AddressForm from "@/components/address-form";
import { useNotification } from "@/components/notification-provider";
import PaymentForm from "@/components/payment-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateShippingAddress } from "@/lib/actions/cart";
import { createOrder } from "@/lib/actions/orders";
import { getShippingMethods } from "@/lib/actions/shipping";
import type { CartItem, ShippingMethod, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface CheckoutFormProps {
  user: User;
  total: number;
  currency: string;
  cart: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export default function CheckoutForm({
  user,
  total,
  currency,
}: CheckoutFormProps) {
  const [activeTab, setActiveTab] = useState("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    name: user.name || "",
    address: "",
    city: "",
    phone: "",
    region: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">(
    "new"
  );
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<string>("");
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchShippingMethods = async () => {
      if (!shippingInfo.region) return;

      setIsLoadingMethods(true);
      try {
        const methods = await getShippingMethods(shippingInfo.region);
        setShippingMethods(methods);

        if (methods.length > 0 && !selectedShippingMethod) {
          setSelectedShippingMethod(methods[0].id);
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      } finally {
        setIsLoadingMethods(false);
      }
    };

    fetchShippingMethods();
  }, [shippingInfo.region, selectedShippingMethod]);

  useEffect(() => {
    if (user.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setShippingInfo({
          name: defaultAddress.name,
          address: defaultAddress.address,
          city: defaultAddress.city,
          phone: defaultAddress.phone || "",
          region: defaultAddress.region,
        });
      }
    }
  }, [user.addresses]);

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);

    if (addressId === "new") {
      setShippingInfo({
        name: user.name || "",
        address: "",
        city: "",
        phone: "",
        region: "",
      });
    } else {
      const selectedAddress = user.addresses?.find(
        (addr) => addr.id === addressId
      );

      if (selectedAddress) {
        setShippingInfo({
          name: selectedAddress.name,
          address: selectedAddress.address,
          city: selectedAddress.city,
          phone: selectedAddress.phone || "",
          region: selectedAddress.region,
        });
      }
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.region || !selectedShippingMethod) {
      addNotification({
        title: "Erreur",
        message: "Veuillez sélectionner une région et une méthode de livraison",
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("region", shippingInfo.region);
      formData.append("city", shippingInfo.city);

      await updateShippingAddress(formData);
    } catch (error) {
      console.error("Error updating shipping address:", error);
    }

    setActiveTab("payment");
  };

  const handlePaymentSuccess = async (paymentMethod: string) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", shippingInfo.name);
      formData.append("address", shippingInfo.address);
      formData.append("city", shippingInfo.city);
      formData.append("phone", shippingInfo.phone);
      formData.append("region", shippingInfo.region);
      formData.append("paymentMethod", paymentMethod);
      formData.append("shippingMethodId", selectedShippingMethod);

      const result = await createOrder(formData);

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        });
        setIsLoading(false);
      } else {
        addNotification({
          title: "Commande créée",
          message: "Votre commande a été créée avec succès!",
          type: "success",
        });
        router.push("/checkout/success");
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message:
          "Une erreur est survenue lors de la création de votre commande.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
        <TabsTrigger value="shipping" className="text-sm sm:text-base">
          Livraison
        </TabsTrigger>
        <TabsTrigger
          value="payment"
          className="text-sm sm:text-base"
          disabled={
            !shippingInfo.name ||
            !shippingInfo.address ||
            !shippingInfo.city ||
            !shippingInfo.phone ||
            !shippingInfo.region
          }
        >
          Paiement
        </TabsTrigger>
      </TabsList>
      <TabsContent value="shipping">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Informations de livraison
          </h2>

          {user.addresses && user.addresses.length > 0 && (
            <div className="mb-6">
              <Label className="mb-2 block">Sélectionnez une adresse</Label>
              <RadioGroup
                value={selectedAddressId}
                onValueChange={handleAddressChange}
                className="space-y-3"
              >
                {user.addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-2">
                    <RadioGroupItem
                      value={address.id}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`address-${address.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="border rounded-md p-3 hover:bg-gray-50">
                        <p className="font-medium">{address.name}</p>
                        <p className="text-sm text-gray-500">
                          {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          {address.city}, {address.region}
                        </p>
                        <p className="text-sm text-gray-500">{address.phone}</p>
                      </div>
                    </Label>
                  </div>
                ))}
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="new"
                    id="address-new"
                    className="mt-1"
                  />
                  <Label
                    htmlFor="address-new"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <p className="font-medium">Nouvelle adresse</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <form onSubmit={handleShippingSubmit} className="space-y-4">
            {selectedAddressId === "new" && (
              <AddressForm
                initialValues={shippingInfo}
                onChange={setShippingInfo}
                showSaveOption={true}
              />
            )}

            <div className="space-y-2 mt-6">
              <Label htmlFor="shipping-method">Méthode de livraison</Label>
              {isLoadingMethods ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
              ) : shippingMethods.length > 0 ? (
                <RadioGroup
                  value={selectedShippingMethod}
                  onValueChange={setSelectedShippingMethod}
                  className="space-y-3"
                >
                  {shippingMethods.map((method) => (
                    <div key={method.id} className="flex items-start space-x-2">
                      <RadioGroupItem
                        value={method.id}
                        id={`method-${method.id}`}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`method-${method.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="border rounded-md p-3 hover:bg-gray-50">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="font-medium text-sm sm:text-base">
                              {method.price.toLocaleString()} {currency}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Livraison estimée: {method.estimatedDeliveryTime}{" "}
                            jours
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-gray-500">
                  Veuillez sélectionner une région pour voir les méthodes de
                  livraison disponibles
                </p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6">
              Continuer vers le paiement
            </Button>
          </form>
        </div>
      </TabsContent>
      <TabsContent value="payment">
        <PaymentForm
          total={total}
          onSuccess={handlePaymentSuccess}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
