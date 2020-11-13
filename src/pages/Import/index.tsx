import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import fileSize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();
  const [inputError, setInputError] = useState('');

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    if (!uploadedFiles.length) return;

    const file = uploadedFiles[0];

    data.append('file', file.file, file.name);

    try {
      await api.post('/transactions/import', data);

      history.push('/');
      setInputError('');
    } catch (err) {
      setInputError('Ocorreu um erro inesperado. Tente novamente.');
    }
  }

  function submitFile(files: File[]): void {
    const uploadFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: fileSize(file.size),
    }));

    setUploadedFiles(uploadFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          {!uploadedFiles.length && <Upload onUpload={submitFile} />}

          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button
              onClick={handleUpload}
              type="button"
              disabled={!uploadedFiles.length || uploadedFiles.length > 1}
            >
              Enviar
            </button>
          </Footer>

          {inputError && <Error>{inputError}</Error>}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
