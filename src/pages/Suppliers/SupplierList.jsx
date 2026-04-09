import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { supplierConfig } from "../../utils/moduleConfigs";

export default function SupplierList() {
  useDocumentTitle("Suppliers • School Stock Management");
  return <CrudPage config={supplierConfig} mode="list" />;
}
