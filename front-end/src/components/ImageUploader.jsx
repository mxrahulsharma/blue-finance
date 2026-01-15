import { useState, useRef } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const ImageUploader = ({ label, value, onChange, accept = 'image/*', maxSize = 5, optimalDimensions, preview }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check file size (maxSize in MB)
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize} MB limit`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        file,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragActive ? 'action.hover' : 'background.paper',
          position: 'relative',
          minHeight: value?.preview ? '200px' : '150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {value?.preview ? (
          <>
            <Box
              component="img"
              src={value.preview}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '180px',
                borderRadius: 1,
                mb: 1,
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                Browse photo
              </Box>{' '}
              or drop here
            </Typography>
            {optimalDimensions && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {optimalDimensions}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Max photo size {maxSize} MB
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ImageUploader;
