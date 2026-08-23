import { FolderOpen } from 'lucide-react';
import YouTubeLinks      from './YouTubeLinks';
import DocumentUploader  from './DocumentUploader';
import FileViewer        from './FileViewer';
import useExamDocuments  from '../../hooks/useExamDocuments';

export default function StudyMaterialTab({ examId }) {
  const { documents, loading, uploadDocument, deleteDocument } = useExamDocuments(examId);

  return (
    <div className="tab-section">
      <div className="tab-section__header"><FolderOpen size={16} /><h3>Study Material</h3></div>
      <YouTubeLinks examId={examId} />
      <DocumentUploader
        loading={loading}
        onUpload={uploadDocument}
      />
      <FileViewer
        documents={documents}
        onDelete={deleteDocument}
      />
    </div>
  );
}
