import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { receivingConfig } from "../../utils/moduleConfigs";

export default function ReceivingDetail() {
  useDocumentTitle("Receiving • School Stock Management");
  return <CrudPage config={receivingConfig} mode="detail" />;
}
