"use client";

import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useTheme } from "../providers/theme-provider";
import { Spin } from "antd";

interface TextEditorProps {
  initialValue?: string;
}

export interface TextEditorHandle {
  getContent: () => string;
  setContent: (content: string) => void;
  getEditor: () => TinyMCEEditor | null;
}

const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(
  (
    { initialValue = "<p>This is the initial content of the editor.</p>" },
    ref,
  ) => {
    const API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getContent() || "",
      setContent: (content: string) => editorRef.current?.setContent(content),
      getEditor: () => editorRef.current,
    }));

    return (
      <>
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <Spin size="large" description="Đang tải trình soạn thảo..." />
          </div>
        )}
        <div style={{ display: isLoading ? "none" : "block" }}>
          <Editor
            key={isDarkMode ? "dark" : "light"}
            apiKey={API_KEY}
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              setIsLoading(false);
            }}
            initialValue={initialValue}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "preview",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              language: "vi",
              content_css: isDarkMode ? "dark" : "default",
              skin: isDarkMode ? "oxide-dark" : "oxide",
            }}
          />
        </div>
      </>
    );
  },
);

TextEditor.displayName = "TextEditor";

export default TextEditor;
