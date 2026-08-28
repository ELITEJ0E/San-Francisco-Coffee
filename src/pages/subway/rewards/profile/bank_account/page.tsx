"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Button } from "@/components/ui/button";
export default function BankAccount() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      <NavbarHeader title="Bank Accounts / Cards" />

      <main className="p-6 bg-white">
        <section className="mb-10">
          <h2 className="text-primary font-semibold mb-2">
            Credit / Debit Card (2)
          </h2>
          <Card className="bg-white mb-5 shadow-lg border-none py-2">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <img
                  src="/images/BankMaster.svg"
                  alt="Mastercard logo"
                  className="mr-4 w-12 h-12"
                />
                <div>
                  <p className="text-primary font-medium">
                    •••• •••• •••• 8967
                  </p>
                  <p className="text-primary text-sm">Expires 09/26</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white mb-5 shadow-lg border-none py-2">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <img
                  src="/images/BankVisa.svg"
                  alt="Visa logo"
                  className="mr-4 w-12 h-12"
                />
                <div>
                  <p className="text-primary font-medium">
                    •••• •••• •••• 8967
                  </p>
                  <p className="text-primary text-sm">Expires 09/26</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white mb-5 shadow-lg border-none py-2">
            <CardContent className="p-4">
              <Button
                variant={"link"}
                className="w-full text-primary font-semibold flex items-center bg-white justify-start"
                onClick={() =>
                  router.push("/profile/bank_account/add_new_card")
                }
              >
                <img
                  src="/images/BankAddNewCard.svg"
                  alt="Add card icon"
                  className="mr-4 w-12 h-12"
                />
                Add New Card
              </Button>
            </CardContent>
          </Card>
        </section>
        <section>
          <h2 className="text-primary font-semibold mb-2">Bank Account</h2>
          <Card className="bg-white mb-5 shadow-lg border-none py-2">
            <CardContent className="p-4">
              <Button
                variant={"link"}
                className="w-full text-primary font-semibold flex items-center bg-white justify-start"
              >
                <img
                  src="/images/BankAddNewCard.svg"
                  alt="Add bank account icon"
                  className="mr-4 w-12 h-12"
                />
                Add New Bank Account
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
