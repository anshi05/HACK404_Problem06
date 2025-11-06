
export async function analyzePdf(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to analyze PDF");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw error;
  }
}
