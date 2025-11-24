import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import MockData from "./mock/index"
export function setUpProdMockServer() {
  createProdMockServer(MockData);
}