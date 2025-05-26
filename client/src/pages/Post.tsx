import React, { useState, useLayoutEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css"; // You can use 'prism-tomorrow.css' for dark theme
import {
  ClassicEditor,
  PictureEditing,
  Base64UploadAdapter,
  Code,
} from "ckeditor5";

import {
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  BlockQuote,
  Image,
  ImageToolbar,
  ImageUpload,
  Table,
  TableToolbar,
  MediaEmbed,
  Undo,
  RemoveFormat,
  SourceEditing,
  CodeBlock,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const Post: React.FC = () => {
  const [content, setContent] = useState("");
  const handleContent = (e: any, editor: any) => {
    setContent(editor.getData());
  };
  useLayoutEffect(() => {
    Prism.highlightAll();
  }, [content]);
  return (
    <div className="ck-editor-container">
      <h1>Create Post</h1>
      <CKEditor
        editor={ClassicEditor}
        onChange={handleContent}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Paragraph,
            Bold,
            Italic,
            Heading,
            Link,
            List,
            BlockQuote,
            Image,
            ImageToolbar,
            ImageUpload,
            Base64UploadAdapter,
            Table,
            TableToolbar,
            MediaEmbed,
            Undo,
            RemoveFormat,
            SourceEditing,
            PictureEditing,
            CodeBlock,
          ],
          toolbar: [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "heading", // ✅ this gives you a working heading dropdown

            "|",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "imageUpload",
            "|",

            "codeBlock",
            "|",
            "removeFormat",
            "sourceEditing",
          ],
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          mediaEmbed: {
            previewsInData: true,
          },

          placeholder: "Start writing your post here...",
        }}
        data="<p>Hello from CKEditor 5 in React!</p>"
      />
      <div
        className="showContent"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </div>
  );
};

export default Post;
