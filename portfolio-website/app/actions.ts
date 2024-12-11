'use server'

interface ContactForm {
  name: string
  email: string
  phone: string
  timeline: string
  service: string
  details: string
}

export async function submitContact(formData: FormData) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const data: ContactForm = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      timeline: formData.get('timeline') as string,
      service: formData.get('service') as string,
      details: formData.get('details') as string,
    }

    // Here you would typically send this data to your backend
    console.log('Form submitted:', data)

    return { success: true, message: 'Message sent successfully!' }
  } catch (error) {
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}