"use client";

import { useState } from "react";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NavbarHeader } from "@/components/layout/NavbarHeader";

export default function AddCreditCardForm() {
  const [cardType, setCardType] = useState("visa");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(Object.fromEntries(formData));
  };

  const getCardTypeDisplay = () => {
    switch (cardType) {
      case "visa":
        return (
          <div className="flex items-center">
            <img
              src="/images/BankVisa.svg"
              alt="Visa logo"
              className="w-12 h-4 mr-2"
            />
            Visa
          </div>
        );
      case "mastercard":
        return (
          <div className="flex items-center">
            <img
              src="/images/BankMaster.svg"
              alt="Mastercard logo"
              className="w-12 h-4 mr-2"
            />
            Mastercard
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen">
      <NavbarHeader title="Add Credit / Debit Card" />

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <h2 className="text-primary text-lg font-medium">
          Credit / Debit Card (2)
        </h2>

        <div className="space-y-2">
          <Label htmlFor="cardType" className="text-sm text-gray-600 font-bold">
            Card Type
          </Label>
          <Select value={cardType} onValueChange={setCardType}>
            <SelectTrigger id="cardType">
              <SelectValue>{getCardTypeDisplay()}</SelectValue>
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="visa">
                <div className="flex items-center">
                  <img
                    src="/images/BankVisa.svg"
                    alt="Visa logo"
                    className="w-12 h-4 mr-2"
                  />
                  Visa
                </div>
              </SelectItem>
              <SelectItem value="mastercard">
                <div className="flex items-center">
                  <img
                    src="/images/BankMaster.svg"
                    alt="Mastercard logo"
                    className="w-12 h-4 mr-2"
                  />
                  Mastercard
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="cardHolder"
            className="text-sm text-gray-600 font-bold"
          >
            Card Holder
          </Label>
          <Input
            id="cardHolder"
            name="cardHolder"
            placeholder="Name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="cardNumber"
            className="text-sm text-gray-600 font-bold"
          >
            Card Number
          </Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="XXXX - XXXX - XXXX - XXXX"
            required
            pattern="\d{4}\s?-?\s?\d{4}\s?-?\s?\d{4}\s?-?\s?\d{4}"
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2 space-y-2">
            <Label htmlFor="month" className="text-sm text-gray-600 font-bold">
              Month
            </Label>
            <Select name="month" required>
              <SelectTrigger id="month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem
                    key={month}
                    value={month.toString().padStart(2, "0")}
                  >
                    {month.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2 space-y-2">
            <Label htmlFor="year" className="text-sm text-gray-600 font-bold">
              Year
            </Label>
            <Select name="year" required>
              <SelectTrigger id="year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ccv" className="text-sm text-gray-600 font-bold">
            CCV
          </Label>
          <div className="relative">
            <Input
              id="ccv"
              name="ccv"
              placeholder="XXX"
              className="w-full pr-8 text-primary"
              required
              pattern="\d{3,4}"
            />
            <HelpCircle className="w-4 h-4 text-tertiary-foreground absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <Button variant={"secondary"} className="w-full rounded-full py-6">
          Add
        </Button>
      </form>
    </div>
  );
}
