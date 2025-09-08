import { useEffect } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Customer } from "@/lib/types";

import { useReplicache } from "../use-replicache";
import { errorToast, successToast } from "./utils";

// Shared customer Replicache configuration
const useCustomerReplicache = () => {
  return useReplicache({
    name: "customers",
    puller: async () => {
      try {
        const customers = await api.get("customer").json<Customer[]>();

        const patch = [
          { op: "clear" },
          ...customers.map((customer: Customer) => ({
            op: "put",
            key: `customer/${customer.id}`,
            value: customer,
          })),
        ];

        return {
          httpRequestInfo: { httpStatusCode: 200, errorMessage: "" },
          patch,
        };
      } catch (error) {
        console.error("Puller error:", error);
        return {
          httpRequestInfo: {
            httpStatusCode: 0,
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          },
        };
      }
    },
    pusher: async (req) => {
      const promises = req.mutations.map((mutation) => api.post("customer", { json: mutation }));

      try {
        const responses = await Promise.all(promises);
        const firstResponse = responses[0];

        return {
          httpRequestInfo: {
            httpStatusCode: firstResponse.status,
            errorMessage: firstResponse.ok ? "" : `Push failed: ${firstResponse.statusText}`,
          },
        };
      } catch (error) {
        console.error("Pusher error:", error);
        return {
          httpRequestInfo: {
            httpStatusCode: 0,
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          },
        };
      }
    },
    mutators: {
      createCustomer: async (tx, customer: Customer) => {
        await tx.set(`customer/${customer.id}`, customer);
      },
      updateCustomer: async (tx, customer: Customer) => {
        await tx.set(`customer/${customer.id}`, customer);
      },
      deleteCustomer: async (tx, id: string) => {
        await tx.del(`customer/${id}`);
      },
    },
  });
};

export function useCustomers() {
  const rep = useCustomerReplicache();

  useEffect(() => {
    if (!rep) return;

    rep.subscribe(
      async (tx) => {
        return await tx.scan<Customer>().values().toArray();
      },
      {
        onData: (customers) => {
          console.log("Customers updated:", customers);
        },
      }
    );
  }, []);

  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!rep) return [];
      return await rep.query((tx) => tx.scan<Customer>().toArray());
    },
    retry: false,
  });
}

export function useCreateCustomer() {
  const rep = useCustomerReplicache();

  return useMutation({
    mutationFn: async (data: Partial<Customer> & { branchId: string }) => {
      // Call API first to get real ID
      const response = await api.post("customers", { json: data }).json<Customer>();

      // Then optimistically add to Replicache with real data
      if (rep && response) {
        await rep.mutate.createCustomer(response);
      }

      return response;
    },
    onSuccess: () => {
      successToast("Customer created successfully");
    },
    onError: errorToast,
  });
}
