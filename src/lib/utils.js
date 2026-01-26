export const generateWhatsAppMessage = (cart, customerInfo) => {
  let message = `Hello! I'd like to place an order:

*Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
${customerInfo.email ? `Email: ${customerInfo.email}\n` : ''}${customerInfo.address ? `Address: ${customerInfo.address}\n` : ''}
*Order Items:*
`;
  
  cart.forEach((item, index) => {
    message += `\n${index + 1}. ${item.name} (x${item.quantity})\n`;
    message += `   Price: ${formatPrice(item.price * item.quantity)}\n`;
    
    if (item.customizable && item.customization) {
      if (item.customization.size) message += `   Size: ${item.customization.size}\n`;
      if (item.customization.flavor) message += `   Flavor: ${item.customization.flavor}\n`;
      if (item.customization.inscription) message += `   Inscription: ${item.customization.inscription}\n`;
      if (item.customization.design) message += `   Design: ${item.customization.design}\n`;
      if (item.customization.guests) message += `   Number of Guests: ${item.customization.guests}\n`;
      if (item.customization.deliveryDate) message += `   Delivery Date: ${item.customization.deliveryDate}\n`;
      if (item.customization.deliveryTime) message += `   Delivery Time: ${item.customization.deliveryTime}\n`;
      if (item.customization.notes) message += `   Special Notes: ${item.customization.notes}\n`;
    }
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `\n*Total: ${formatPrice(total)}*\n\n`;
  message += "Please confirm availability and payment details. Thank you!";

  return encodeURIComponent(message);
};