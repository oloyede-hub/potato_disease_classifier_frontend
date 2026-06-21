'use client';

import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Upload, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Classification {
  label: string;
  confidence: string | number;
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #18181b;
  color: #e4e4e7;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Wrapper = styled.div`
  max-width: 672px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 24px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PotatoIcon = styled.div`
  width: 56px;
  height: 56px;
//   background: #eab308;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #a1a1aa;
  margin: 0;
`;

const Card = styled.div`
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.4);
`;

const DropZone = styled.div<{ $isDragOver: boolean }>`
  padding: 80px 24px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed ${props => (props.$isDragOver ? '#eab308' : '#52525b')};
  background: ${props => (props.$isDragOver ? 'rgba(234, 179, 8, 0.1)' : 'transparent')};
  transition: all 0.3s ease;

  &:hover {
    border-color: #eab308;
  }
`;

const PreviewContainer = styled.div`
  padding: 32px;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  border-radius: 16px;
  background: #000;
  border: 1px solid #3f3f46;
`;

const ClassifyButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(to right, #eab308, #f59e0b);
  color: #18181b;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(234 179 8 / 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 40px;
`;

const ResultImage = styled.img`
  width: 288px;
  height: 288px;
  object-fit: cover;
  border-radius: 24px;
  border: 4px solid rgba(234, 179, 8, 0.3);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
`;

const Badge = styled.div`
  position: absolute;
  top: -16px;
  right: -16px;
  background: #eab308;
  color: #18181b;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 6px 20px;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
`;

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(63, 63, 70, 0.5);
  padding: 20px 24px;
  border-radius: 16px;
  margin-bottom: 12px;
`;

function PotatoClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [results, setResults] = useState<Classification[] | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'


  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
    setResults(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const classifyPotato = async () => {
    if (!image) return;

    setIsClassifying(true);
    const formData = new FormData();
    formData.append("file", file as Blob);
    try {
      console.log("Sending request to:", `${API_URL}/predict`);
      console.log("FormData contents:", formData.get("file"));
      const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            body: formData,
          })
          if(!response.ok) {
            throw new Error("Failed to classify potato");
          }
          const data = await response.json();
          // Normalize the results
          const normalizedResults: Classification[] = Object.entries(data).map(arrpred => ({label: arrpred[0], confidence: arrpred[1] as number}));
          setResults(normalizedResults);
          setIsClassifying(false);
    }catch(e) {
      console.error("Classification error:", e);
    }
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setResults(null);
  };

  return (
    <Container>
        <Header>
          <Logo>
            <PotatoIcon>
                <Image src="/potato.jpg" alt="Potato icon" width={56} height={56} style={{ borderRadius: "16px"}} />
            </PotatoIcon>
            <div>
              <Title>Potato Leaf Disease Classifier</Title>
              <Subtitle>What kind of potato leaf disease is this?</Subtitle>
            </div>
          </Logo>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', padding: '4px 12px', borderRadius: '9999px' }}>
            v1.0
          </div>
        </Header>
      <Wrapper>
        <Card>
          {/* Upload Zone */}
          {!image && (
            <DropZone
              $isDragOver={isDragOver}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              <div style={{ margin: '0 auto 24px', width: '80px', height: '80px', background: '#3f3f46', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={48} color="#eab308" />
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '12px' }}>
                Drop your potato image here
              </h3>
              <p style={{ color: '#a1a1aa', marginBottom: '32px' }}>or click to browse</p>

              <button style={{ padding: '14px 32px', background: '#eab308', color: '#18181b', fontWeight: 600, borderRadius: '9999px', border: 'none', fontSize: '1.1rem' }}>
                Select Image
              </button>

              <p style={{ marginTop: '32px', fontSize: '0.8rem', color: '#71717a' }}>
                JPG, PNG, WEBP • Max 10MB
              </p>
            </DropZone>
          )}

          {/* Preview */}
          {image && !results && (
            <PreviewContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Your Potato Leaf</h2>
                <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <RotateCcw size={18} /> New Photo
                </button>
              </div>

              <ImagePreview src={image} alt="Potato leaf preview" />

              <ClassifyButton onClick={classifyPotato} disabled={isClassifying}>
                {isClassifying ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Sparkles size={24} /> CLASSIFY DISEASE
                  </>
                )}
              </ClassifyButton>
            </PreviewContainer>
          )}

          {/* Results */}
          {results && image && (
            <PreviewContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Classification Result</h2>
                <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <RotateCcw size={18} /> Try Another
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <ResultImageWrapper>
                  <ResultImage src={image} alt="Classified potato" />
                  <Badge>ANALYZED</Badge>
                </ResultImageWrapper>
              </div>

              <div>
                {results.map((result, i) => (
                  <ResultRow key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '9999px', background: '#eab308' }} />
                      <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fef08a' }}>{result.label}</span>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#eab308', textAlign: 'right' }}>
                        {typeof result.confidence === 'number' ? `${Number(result.confidence).toFixed(0)}%` : result.confidence}
                      </span>
                    </div>
                  </ResultRow>
                ))}
              </div>
            </PreviewContainer>
          )}
        </Card>

        
      </Wrapper>
    </Container>
  );
}

export default PotatoClassifier;
