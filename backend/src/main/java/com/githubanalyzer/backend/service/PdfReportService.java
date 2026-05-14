package com.githubanalyzer.backend.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdfReportService {

    public byte[] buildSimplePdf(String title, String markdown) {
        List<String> lines = normalizeLines(title, markdown);
        StringBuilder content = new StringBuilder();
        content.append("BT\n/F1 16 Tf\n50 780 Td\n");

        int renderedLines = 0;
        for (String line : lines) {
            if (renderedLines >= 42) {
                content.append("(Report truncated for PDF preview. Download Markdown for full details.) Tj\n");
                break;
            }
            int fontSize = line.startsWith("#") ? 14 : 10;
            content.append("/F1 ").append(fontSize).append(" Tf\n");
            content.append("(").append(escapePdfText(cleanMarkdown(line))).append(") Tj\n");
            content.append("0 -18 Td\n");
            renderedLines++;
        }
        content.append("ET");

        byte[] stream = content.toString().getBytes(StandardCharsets.UTF_8);
        List<String> objects = new ArrayList<>();
        objects.add("<< /Type /Catalog /Pages 2 0 R >>");
        objects.add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        objects.add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>");
        objects.add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
        objects.add("<< /Length " + stream.length + " >>\nstream\n" + content + "\nendstream");

        StringBuilder pdf = new StringBuilder("%PDF-1.4\n");
        List<Integer> offsets = new ArrayList<>();
        for (int i = 0; i < objects.size(); i++) {
            offsets.add(pdf.toString().getBytes(StandardCharsets.UTF_8).length);
            pdf.append(i + 1).append(" 0 obj\n").append(objects.get(i)).append("\nendobj\n");
        }

        int xrefOffset = pdf.toString().getBytes(StandardCharsets.UTF_8).length;
        pdf.append("xref\n0 ").append(objects.size() + 1).append("\n");
        pdf.append("0000000000 65535 f \n");
        for (Integer offset : offsets) {
            pdf.append(String.format("%010d 00000 n \n", offset));
        }
        pdf.append("trailer\n<< /Size ").append(objects.size() + 1).append(" /Root 1 0 R >>\n");
        pdf.append("startxref\n").append(xrefOffset).append("\n%%EOF");
        return pdf.toString().getBytes(StandardCharsets.UTF_8);
    }

    private List<String> normalizeLines(String title, String markdown) {
        List<String> lines = new ArrayList<>();
        lines.add(title == null || title.isBlank() ? "GitHub Project Analysis Report" : title);
        if (markdown == null) {
            return lines;
        }
        for (String rawLine : markdown.split("\\R")) {
            String line = rawLine.trim();
            if (line.isBlank()) {
                continue;
            }
            splitLongLine(line, lines);
        }
        return lines;
    }

    private void splitLongLine(String line, List<String> lines) {
        int maxLength = 92;
        String remaining = line;
        while (remaining.length() > maxLength) {
            lines.add(remaining.substring(0, maxLength));
            remaining = remaining.substring(maxLength);
        }
        lines.add(remaining);
    }

    private String cleanMarkdown(String line) {
        return line.replace("#", "").replace("**", "").replace("`", "").trim();
    }

    private String escapePdfText(String text) {
        return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)");
    }
}
