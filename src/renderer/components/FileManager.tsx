import React, { useState } from 'react';

const FileManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  const handleSelectFile = async () => {
    try {
      const filePath = await window.api.selectFile({
        title: 'Select a text file',
        filters: [
          { name: 'Text Files', extensions: ['txt', 'md', 'json', 'js', 'ts', 'html', 'css'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        setSelectedFile(filePath);
        await loadFileContent(filePath);
      }
    } catch (error) {
      console.error('Failed to select file:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'File Selection Error',
        message: 'Failed to select file',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const loadFileContent = async (filePath: string) => {
    try {
      setLoading(true);
      const content = await window.api.readFileText(filePath);
      setFileContent(content);
    } catch (error) {
      console.error('Failed to read file:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'File Read Error',
        message: 'Failed to read file content',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;

    try {
      await window.api.writeFileText(selectedFile, fileContent);
      await window.api.showMessageBox({
        type: 'info',
        title: 'Success',
        message: 'File saved successfully'
      });
    } catch (error) {
      console.error('Failed to save file:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'File Save Error',
        message: 'Failed to save file',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleSaveAs = async () => {
    try {
      const filePath = await window.api.showSaveDialog({
        title: 'Save File As',
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        await window.api.writeFileText(filePath, fileContent);
        setSelectedFile(filePath);
        await window.api.showMessageBox({
          type: 'info',
          title: 'Success',
          message: 'File saved successfully'
        });
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'File Save Error',
        message: 'Failed to save file',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleSelectFolder = async () => {
    try {
      const folderPath = await window.api.selectFolder({
        title: 'Select a folder'
      });

      if (folderPath) {
        await window.api.showMessageBox({
          type: 'info',
          title: 'Folder Selected',
          message: `Selected folder: ${folderPath}`
        });
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'Folder Selection Error',
        message: 'Failed to select folder',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="card">
        <h2 style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>
          File Manager
        </h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button onClick={handleSelectFile} className="btn btn-primary">
            📁 Open File
          </button>
          <button onClick={handleSelectFolder} className="btn btn-secondary">
            📂 Select Folder
          </button>
          {selectedFile && (
            <>
              <button 
                onClick={handleSaveFile} 
                className="btn btn-primary"
                disabled={loading}
              >
                💾 Save
              </button>
              <button onClick={handleSaveAs} className="btn btn-outline">
                💾 Save As...
              </button>
            </>
          )}
        </div>

        {selectedFile && (
          <div className="form-group">
            <label className="form-label">Current File:</label>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '12px',
              borderRadius: 'var(--border-radius)',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              wordBreak: 'break-all'
            }}>
              {selectedFile}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="fileContent">
            File Content {loading && <span className="spinner" style={{ marginLeft: '8px' }}></span>}
          </label>
          <textarea
            id="fileContent"
            className="form-input"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            disabled={loading}
            style={{
              height: '400px',
              resize: 'vertical',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
            placeholder="Select a file to view and edit its content..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {fileContent.length} characters, {fileContent.split('\n').length} lines
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {selectedFile ? 'File loaded' : 'No file selected'}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
          Recent Files
        </h3>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Recent files will appear here after you open them.
        </div>
      </div>
    </div>
  );
};

export default FileManager;
