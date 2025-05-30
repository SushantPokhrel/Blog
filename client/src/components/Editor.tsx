import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";

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
type EditorProps = {
  handleContent: (event:any, editor: any) => void;
};
const Editor: React.FC<EditorProps> = ({ handleContent }) => {
  return (
    <div>
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
            "heading",
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
      />{" "}
    </div>
  );
};

export default Editor;
