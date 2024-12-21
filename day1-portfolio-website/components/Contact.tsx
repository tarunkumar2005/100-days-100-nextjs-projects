'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { contactConfig } from '@/lib/config'
import { submitContact } from '@/app/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "px-8 py-3 rounded-md font-medium transition-all duration-200",
        "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white",
        "hover:from-purple-700 hover:to-fuchsia-600",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "w-full md:w-auto ml-auto block"
      )}
    >
      {pending ? 'Sending...' : 'Send'}
    </button>
  )
}

export function Contact() {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await submitContact(formData);
  
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message, // This should now be strongly typed as a string
    });
  
    if (result.success) {
      const form = document.getElementById('contact-form') as HTMLFormElement;
      form.reset();
    }
  }  

  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-white">
            {contactConfig.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {contactConfig.subtitle}
          </p>
        </div>

        <form
          id="contact-form"
          action={handleSubmit}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-400">Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-[#111111] border-gray-800 focus:border-purple-500 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-[#111111] border-gray-800 focus:border-purple-500 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-400">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                className="bg-[#111111] border-gray-800 focus:border-purple-500 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-gray-400">Timeline</Label>
              <Input
                id="timeline"
                name="timeline"
                required
                className="bg-[#111111] border-gray-800 focus:border-purple-500 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service" className="text-gray-400">Service Of Interest</Label>
            <Select name="service" required>
              <SelectTrigger className="bg-[#111111] border-gray-800 focus:border-purple-500 text-white">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-gray-800">
                {contactConfig.services.map((service) => (
                  <SelectItem
                    key={service}
                    value={service}
                    className="text-white hover:bg-purple-500/10 focus:bg-purple-500/10"
                  >
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-gray-400">Project Details</Label>
            <Textarea
              id="details"
              name="details"
              required
              className="bg-[#111111] border-gray-800 focus:border-purple-500 text-white min-h-[150px]"
            />
          </div>

          {message && (
            <div className={cn(
              "p-4 rounded-md",
              message.type === 'success' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            )}>
              {message.text}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </section>
  )
}