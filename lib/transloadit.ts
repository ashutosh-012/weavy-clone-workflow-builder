interface TransloaditAssembly {
  ok: string;
  assembly_id: string;
  assembly_url: string;
  assembly_ssl_url: string;
  results?: Record<string, any[]>;
}

export async function uploadImageToTransloadit(file: File, userId: string): Promise<string> {
  const formData = new FormData();
  
  const params = {
    auth: {
      key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY!,
    },
    steps: {
      import: {
        robot: '/upload/handle',
      },
      optimize: {
        use: 'import',
        robot: '/image/optimize',
        progressive: true,
        quality: 85,
      },
      export: {
        use: 'optimize',
        robot: '/s3/store',
        credentials: 'transloadit_default',
        path: `workflows/${userId}/${Date.now()}-${file.name}`,
      },
    },
  };

  formData.append('params', JSON.stringify(params));
  formData.append('file', file);

  const response = await fetch('https://api2.transloadit.com/assemblies', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Transloadit upload failed');
  }

  const result: TransloaditAssembly = await response.json();
  
  if (result.results?.export?.[0]?.ssl_url) {
    return result.results.export[0].ssl_url;
  }

  throw new Error('No URL returned from Transloadit');
}

export async function uploadVideoToTransloadit(file: File, userId: string): Promise<string> {
  const formData = new FormData();
  
  const params = {
    auth: {
      key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY!,
    },
    steps: {
      import: {
        robot: '/upload/handle',
      },
      encode: {
        use: 'import',
        robot: '/video/encode',
        preset: 'iphone',
        ffmpeg_stack: 'v6.0.0',
      },
      export: {
        use: 'encode',
        robot: '/s3/store',
        credentials: 'transloadit_default',
        path: `workflows/${userId}/${Date.now()}-${file.name}`,
      },
    },
  };

  formData.append('params', JSON.stringify(params));
  formData.append('file', file);

  const response = await fetch('https://api2.transloadit.com/assemblies', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Transloadit upload failed');
  }

  const result: TransloaditAssembly = await response.json();
  
  if (result.results?.export?.[0]?.ssl_url) {
    return result.results.export[0].ssl_url;
  }

  throw new Error('No URL returned from Transloadit');
}

export async function getBase64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}