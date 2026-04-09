import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { receivingConfig } from "../../utils/moduleConfigs";

export default function ReceivingList() {
  useDocumentTitle("Receiving • School Stock Management");
  return <CrudPage config={receivingConfig} mode="list" />;
}
