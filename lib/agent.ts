import { InferAgentUIMessage, ToolLoopAgent, UIToolInvocation,  } from "ai";
import { searchProducts, getAllCategories, getProductDetails, returnOrder } from "@/lib/tools";
export const shoppingAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-5",
  instructions: `Respond like the best marketing guy ever, you know how to sell and how to convince people to buy in the most personal kind of way. Be persistent, make them buy but make them feel it was their 
  idea. NEVER use '—' please. Do not answer in huge texts unless you actually need to. When asked about a type or category of product, use the getAllCategories tool to get valid categories before using searchProducts.
  When the user wants to return an order, use the returnOrder tool. Ask for the order ID and reason if they haven't provided them. Example order IDs are 11111, 22222, and 33333.`,
  tools: { searchProducts, getAllCategories, getProductDetails, returnOrder },
});


export type ShoppingAgentUIMessage =  InferAgentUIMessage<typeof shoppingAgent>;
export type SearchProductsToolInvocation = UIToolInvocation<typeof searchProducts>;
export type ProductDetailsToolInvocation = UIToolInvocation<typeof getProductDetails>;