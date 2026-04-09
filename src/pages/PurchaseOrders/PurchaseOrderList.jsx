import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { purchaseOrderConfig } from "../../utils/moduleConfigs";

export default function PurchaseOrderList() {
  useDocumentTitle("Purchase Orders • School Stock Management");
  return <CrudPage config={purchaseOrderConfig} mode="list" />;
}
