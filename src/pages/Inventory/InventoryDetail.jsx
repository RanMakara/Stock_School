import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { inventoryConfig } from "../../utils/moduleConfigs";

export default function InventoryDetail() {
  useDocumentTitle("Inventory • School Stock Management");
  return <CrudPage config={inventoryConfig} mode="detail" />;
}
